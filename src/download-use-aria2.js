const util = require('util');
const request = require('request');
const post = util.promisify(request.post);

const downloadUseAria2 = (rpcRequest) => {
  post(rpcRequest)
    .then((response) => {
      logger.log('[aria2]: ', JSON.stringify(response.body));
    })
    .catch((error) => {
      logger.error('[aria2-error]: ', JSON.stringify(error));
    });
};

module.exports = downloadUseAria2;
