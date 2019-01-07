const fs = require('fs');

const readFirstLine = (path, callback) => {
  const rs = fs.createReadStream(path, {encoding: 'utf8'});
  let acc = '';
  let pos = 0;
  let index;
  rs
    .on('data', function (chunk) {
      index = chunk.indexOf('\n');
      acc += chunk;
      index !== -1 ? rs.close() : pos += chunk.length;
    })
    .on('close', function () {
      callback(null, acc.slice(0, pos + index));
    })
    .on('error', function (err) {
      callback(err);
    });
}

module.exports = readFirstLine;
