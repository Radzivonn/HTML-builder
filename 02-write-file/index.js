const fs = require('fs');
const path = require('path');
const rl = require('readline');

const cmd = rl.createInterface(process.stdin, process.stdout);
const fileWriteStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

console.log('Hi, dude! Enter text!');

cmd
  .on('line', inputData => inputData === 'exit' ? cmd.close() : fileWriteStream.write(inputData))
  .on('close', () => console.log('Bye bye!'));