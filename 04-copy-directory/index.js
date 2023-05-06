const fs = require('fs');
const path = require('path');

const copyDir = (folderName) => {
  const srcFilesDir = path.join(__dirname, folderName);
  const copyFilesDir = path.join(__dirname, 'files-copy');
  fs.mkdir(copyFilesDir, { recursive: true}, err => {
    if (err) throw err;
  });
  fs.readdir(srcFilesDir, (err, files) => {
    if (err) throw err;
    else {
      files.forEach(file => {
        const srcFilePath = path.join(srcFilesDir, file);
        const copyFilePath = path.join(copyFilesDir, file);
        fs.open(copyFilePath, 'w', (err) => {
          if(err) throw err;
        });
        fs.copyFile(srcFilePath, copyFilePath, err => {
          if (err) throw err;
        });
      });
    }
  });
};

copyDir('files');