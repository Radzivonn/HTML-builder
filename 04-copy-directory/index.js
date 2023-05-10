const { readdir, open, rm } =  require('node:fs/promises');
const { mkdir, copyFile } =  require('node:fs');
const path = require('path');

async function getFiles (dirPath) {
  try {
    return await readdir(dirPath);
  } catch (err) {
    console.error(err);
  }
}

const copyFiles = (files, srcFilesDir, copyFilesDir) => {
  files.forEach(file => {
    const srcFilePath = path.join(srcFilesDir, file);
    const copyFilePath = path.join(copyFilesDir, file);
    open(copyFilePath, 'w');
    copyFile(srcFilePath, copyFilePath, err => {
      if (err) throw err;
    });
  });
};

const copyDir = (folderName) => {
  const srcFilesDir = path.join(__dirname, folderName);
  const copyFilesDir = path.join(__dirname, 'files-copy');
  mkdir(copyFilesDir, { recursive: true}, err => {
    if (err) throw err;
  });
  getFiles(srcFilesDir).then(data => copyFiles(data, srcFilesDir, copyFilesDir));
};

rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true })
  .then(() => copyDir('files'));
