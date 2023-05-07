const { readdir } =  require('node:fs/promises');
const { stat } =  require('node:fs');
const path = require('path');

async function getFiles (dirPath) {
  try {
    return await readdir(dirPath);
  } catch (err) {
    console.error(err);
  }
}

const getFileData = (folderName, fileName) => {
  stat(path.join(__dirname, folderName, fileName),
    (err, stats) => {
      if (err) throw err;
      else if (stats.isFile(fileName))
        console.log(`${fileName.slice(0, fileName.indexOf('.'))} - ${path.extname(fileName).slice(1)} - ${Math.ceil(stats.size / 1024)}kb`);
    });
};

const getFilesData = (folderName, files) => files.forEach(file => getFileData(folderName, file));


getFiles(path.join(__dirname, 'secret-folder')).then(data => getFilesData('secret-folder', data));