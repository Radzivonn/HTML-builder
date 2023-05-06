const fs = require('fs');
const path = require('path');

const bundleWriteStream = fs.createWriteStream(path.join(__dirname, 'project-dist/bundle.css'));

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) throw err;
  else {
    files.forEach(file => {
      const cssFilePath = path.join(__dirname, 'styles/', file);
      fs.stat(cssFilePath,
        (err, stats) => {
          if (err) throw err;
          if (stats.isFile(file) && path.extname(file) === '.css') {
            const cssReadStream = fs.createReadStream(cssFilePath, 'utf-8');
						cssReadStream.pipe(bundleWriteStream);
          }
        });
    });
  }
});