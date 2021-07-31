const fs = require('fs')
// fs.writeFileSync('./.env', `HYPI_DOMAIN=${process.env.HYPI_DOMAIN}\n`)
//new
var data = fs.readFileSync('./src/config.ts'); //read existing contents into data
var fd = fs.openSync('./src/config.ts', 'w+');
var buffer = new Buffer(`const HYPI_DOMAIN='${process.env.HYPI_DOMAIN}'\n`);

fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data
// or fs.appendFile(fd, data);
fs.close(fd);

// fs.('./src/config.ts', `const HYPI_DOMAIN='${process.env.HYPI_DOMAIN}'\n`)