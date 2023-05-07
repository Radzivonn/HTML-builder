const { readdir } =  require('node:fs/promises');
const { createReadStream, createWriteStream, stat } =  require('node:fs');
const path = require('path');

async function getFiles (dirPath) {
  try {
    return await readdir(dirPath);
  } catch (err) {
    console.error(err);
  }
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

const createBundle = (files) => {
  const bundleWriteStream = createWriteStream(path.join(__dirname, 'project-dist/bundle.css'));
  files.forEach(file => {
    writeToBundle(file, path.join(__dirname, 'styles/', file), bundleWriteStream);
  });
};

getFiles(path.join(__dirname, 'styles')).then(data => createBundle(data));