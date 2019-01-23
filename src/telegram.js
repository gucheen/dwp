const util = require('util');
const request = require('request');

const config = require('../config');
const token = config.telegramToken;
const id = config.telegramId;

const post = util.promisify(request.post);

exports.handleUrls = (urls) => {
  urls.forEach((url) => {
    post({
      uri: `https://api.telegram.org/bot${token}/sendPhoto`,
      headers: { 'Content-Type': 'application/json' },
      body: {
        chat_id: id,
        photo: url.url,
      },
      json: true,
    })
    .then((response) => {
    })
    .catch((error) => {
    });
  });
};
