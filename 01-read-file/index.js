const fs = require('fs');
const path = require('path');

const { stdout, stderr } = process;
const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let data = '';

readStream
	.on('data', chunk => data += chunk)
	.on('end', () => stdout.write(data))
	.on('error', error => stderr.write(error.message));