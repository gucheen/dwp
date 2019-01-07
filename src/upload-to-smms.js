const fs = require('fs');
const request = require('request');
const path = require('path');

const upload = ({ file }) => {
  const options = {
    method: 'POST',
    url: 'https://sm.ms/api/upload',
    headers:
    {
      'User-Agent': 
'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3642.0 Mobile Safari/537.36'
    },
    formData:
    {
      smfile:
      {
        value: fs.createReadStream(file),
        options: {
          filename: path.basename(file),
        },
      },
    },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    console.log(body);
  });
};

module.exports = {
  upload,
};
