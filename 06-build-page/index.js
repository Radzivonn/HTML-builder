const { readdir, readFile } =  require('node:fs/promises');
const { mkdir, createReadStream, createWriteStream } =  require('node:fs');
const path = require('path');

const createDistFolder = (folderPath) => {
  mkdir(folderPath, { recursive: true }, err => {
    if (err) throw err;
  });
};

async function getFiles (dirPath) {
  try {
    return await readdir(dirPath);
  } catch (err) {
    console.error(err);
  }
}

async function insertComponent(componentsPath, component) {
  return pageLayout.replace(`{{${component.slice(0, component.indexOf('.'))}}}`, await readFile(path.join(componentsPath, component), 'utf-8'));
}

async function insertComponents(componentsPath) {
  const files = await getFiles(componentsPath);
  for await (const file of files) pageLayout = await insertComponent(componentsPath, file);
  return pageLayout;
}

async function buildPage(componentsPath) {
  const htmlWriteStream = createWriteStream(path.join(__dirname, 'project-dist/index.html'));
  htmlWriteStream.write(await insertComponents(componentsPath));
}

createDistFolder(path.join(__dirname, 'project-dist'));

const templateReadStream = createReadStream(path.join(__dirname, 'template.html'));

let pageLayout = '';

templateReadStream
  .on('data', data => pageLayout += data)
  .on('end', () => {
    buildPage(path.join(__dirname, 'components'));
  });