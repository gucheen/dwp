const path = require('path');
const { getResources } = require('./get-pics');
const db = require('./database');
const downloadUseAria2 = require('./download-use-aria2');
const logger = require('./logger');
const config = require('../config');
const { handleUrls } = require('./telegram');

const postHandler = ({ uid, aria2 = false, all = false }) => {
  logger.log(`[start]: ${uid}`);
  return getResources({ uid, all })
  .then(({ urls, data, user }) => {
    if (urls.length === 0) {
      logger.log(`${uid} 没有新图片`);
      return;
    }
    const picsColc = db.client.db(db.dbName).collection(`${uid}_pics`);
    picsColc.insertMany(urls, (err, result) => {
      if (err) {
        logger.error(err);
        return;
      }
      logger.log(`[db updated] ${uid}_pics`);
    });
    const dataColc = db.client.db(db.dbName).collection(`${uid}_data`);
    dataColc.insertMany(data, (err, result) => {
      if (err) {
        logger.error(err);
        return;
      }
      logger.log(`[db updated] ${uid}_data`);
    });
    db.updateOne({ collection: 'users', updater: user, options: { upsert: true } }, (err, result) => {
      if (err) {
        logger.error(err);
        return;
      }
      logger.log(`[db updated] users: ${uid}`);
    });

    if (config.telegramId) {
      handleUrls(urls);
    }

    if (aria2) {
      const aria2Params = urls.map((urlPair) => ({
        methodName: 'aria2.addUri',
        params: [
          `token:${config.aria2Token}`,
          [
            urlPair.url,
          ],
          {
            dir: path.join(config.saveDir, `pics/${uid}`),
          },
        ],
      }));
      const rpcRequest = {
        uri: 'http://localhost:6800/jsonrpc',
        body: {
          jsonrpc: '2.0',
          id: uid,
          method: 'system.multicall',
          params: [
              aria2Params,
          ],
        },
        json: true,
      };
      downloadUseAria2(rpcRequest);
    }
  })
  .catch((error) => {
    console.error(error);
  });
};

module.exports = {
  postHandler,
};
