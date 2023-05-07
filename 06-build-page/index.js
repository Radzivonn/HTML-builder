const { readdir, readFile } =  require('node:fs/promises');
const { mkdir, createReadStream, createWriteStream, stat } =  require('node:fs');
const path = require('path');

const createFolder = (folderPath) => {
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

const writeToBundle = (fileName, filePath, writeStream) => {
  stat(filePath,
    (err, stats) => {
      if (err) throw err;
      if (stats.isFile(fileName) && path.extname(fileName) === '.css') {
        const cssReadStream = createReadStream(filePath, 'utf-8');
        cssReadStream.pipe(writeStream);
      }
    });
};

async function createBundleCSS() {
  const stylesPath = path.join(__dirname, 'styles');
  const files = await getFiles(stylesPath);
  const bundleWriteStream = createWriteStream(path.join(__dirname, 'project-dist/style.css'));
  files.forEach(file => {
    writeToBundle(file, path.join(stylesPath, file), bundleWriteStream);
  });
}


createFolder(path.join(__dirname, 'project-dist')); // create dist folder

const templateFileReadStream = createReadStream(path.join(__dirname, 'template.html'));
let pageLayout = '';

templateFileReadStream
  .on('data', data => pageLayout += data)
  .on('end', () => {
    buildPage(path.join(__dirname, 'components'));
  });

createBundleCSS();