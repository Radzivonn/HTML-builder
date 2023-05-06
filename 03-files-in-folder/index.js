const fs = require('fs');
const path = require('path');

const readFilesFromFolder = (folderName) => {
  fs.readdir(path.join(__dirname, folderName), (err, files) => {
		if (err) throw err;
    else {
      files.forEach(file => {
        fs.stat(path.join(__dirname, folderName + '/' + file),
          (err, stats) => {
            if (err) throw err;
            else if (stats.isFile(file))
              console.log(`${file.slice(0, file.indexOf('.'))} - ${path.extname(file).slice(1)} - ${stats.size / 1000}kb`);
          });
      });
    }
  });
};

readFilesFromFolder('secret-folder');