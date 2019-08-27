const url = require('url');
const fs = require('fs');
const {promisify} = require('util');
const http = require('http');
const path = require('path');

const server = new http.Server();

const fsStatAsync = promisify(fs.stat);
const readFileAsync = promisify(fs.readFile);

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      try {
        if (pathname.search('/') !== -1) {
          res.statusCode = 400;
          res.end();
        }

        const stats = await fsStatAsync(filepath);

        if (stats.isFile()) {
          try {
            const file = await readFileAsync(filepath);
            res.statusCode = 200;
            res.end(file);
          } catch (e) {
            res.statusCode = 500;
            res.end('Error of reading file');
          }
        }
      } catch (err) {
        res.statusCode = 404;
        res.end('File not found');
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
