const { readdir, readFile, open, rm } =  require('node:fs/promises');
const { mkdir, createReadStream, createWriteStream, stat, copyFile } =  require('node:fs');
const path = require('path');

/* Functions */
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

async function copyFileToDist(srcFilePath, copyFilePath) {
  let filehandle; 
  try {
    filehandle = await open(copyFilePath, 'w');
    copyFile(srcFilePath, copyFilePath, err => {
      if (err) throw err;
    });
  } finally {
    await filehandle.close();
  }
}

const copyFiles = (files, srcPath, distPath) => {
  files.forEach(file => {
    const srcFilePath = path.join(srcPath, file);
    const copyFilePath = path.join(distPath, file);
    stat(srcFilePath,
      (err, stats) => {
        if (err) throw err;
        if (!stats.isFile(file)) copyDir(file, srcFilePath, distPath); /* recursively copy dir */
        else {
          copyFileToDist(srcFilePath, copyFilePath);
        }
      });
  });
};

const copyDir = (folderName, srcPath, distPath) => {
  const copyFilesPath = path.join(distPath, folderName);
  createFolder(copyFilesPath);
  getFiles(srcPath).then(files => copyFiles(files, srcPath, copyFilesPath));
};
/* Functions */

/* build */

createFolder(path.join(__dirname, 'project-dist')); // create dist folder

const templateFileReadStream = createReadStream(path.join(__dirname, 'template.html'));
let pageLayout = ''; // string that contains HTML layout

/* build a page from components */
templateFileReadStream
  .on('data', data => pageLayout += data)
  .on('end', () => {
    buildPage(path.join(__dirname, 'components'));
  });

createBundleCSS();

/* delete project-dist/assets(if it exists) and copy it again */
rm(path.join(__dirname, 'project-dist/assets'), { recursive: true, force: true })
  .then(() => copyDir('assets', path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist')));

/* build */