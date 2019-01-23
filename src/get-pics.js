const request = require('request');
const util = require('util');

const logger = require('./logger');
const db = require('./database');

const get = util.promisify(request.get);

const sleep = (ms) => {
  return new Promise((resolve) => {
      setTimeout(resolve, ms);
  });
};

const getResources = async ({ uid, all = false }) => {
  let latestId;
  if (!all) {
    const collection = db.client.db(db.dbName).collection(`${uid}_data`);
    const latest = await collection.find({}).sort({ id: -1 }).limit(1).toArray();
    if (latest.length) {
      latestId = latest[0].id.toString();
    }
  }
  let page = 1;
  const count = 25;
  let total = 0;
  let amount = 0;
  const urls = [];
  const data = [];
  let user;
  while(true) {
    const url = util.format('https://m.weibo.cn/api/container/getIndex?count=%s&page=%s&containerid=107603%s', count, page, uid);
    const response = await get({
      uri: url,
      json: true,
      timeout: 10000,
    })
    if (!response || response.statusCode !== 200) {
      continue;
    }
    const body = response.body;
    if (body.ok === 0) {
      break;
    }
    if (total === 0) {
      total = body.data.cardlistInfo.total;
    }
    const cards = body.data.cards;
    let nextExists = false;
    cards.some(async (card) => {
      const mblog = card.mblog;
      if (mblog.isTop) {
        const exist = await collection.countDocuments({ id: mblog.id }) > 0;
        if (exist) {
          return false;
        }
      }
      if (latestId && latestId === mblog.id) {
        nextExists = true;
        return true;
      }
      if (mblog) {
        if (typeof user === 'undefined'
          && typeof mblog.user === 'object'
          && mblog.user.id.toString() === uid) {
          user = Object.assign({}, mblog.user);
        }
        amount += 1;
        // const props = ['created_at', 'id', 'text', 'thumbnail_pic'];
        const single = {
          createdAt: mblog.created_at,
          id: mblog.id,
          text: mblog.text,
          thumbnail: mblog.thumbnail_pic,
          pics: [],
        };
        // logger.log('analysing weibos... %s', );
        if (mblog.pics) {
          mblog.pics.forEach((pic) => {
            if (pic.large) {
              urls.push({
                id: pic.pid,
                url: pic.large.url,
              });
              single.pics.push({
                id: pic.pid,
                url: pic.large.url,
              });
            }
          });
        } else if (mblog.video && mblog.page_info) {
          if (mblog.page_info.media_info && mblog.page_info.media_info.stream_url) {
            urls.push(mblog.page_info.media_info && mblog.page_info.media_info.stream_url);
          }
        }
        data.push(single);
      }
    });
    if (nextExists) {
      logger.log(`ID: ${latestId} 开始已经获取过`);
      break;
    }
    page += 1;
    await sleep(1000);
  }
  logger.log(`[requested]: ${uid}`);
  return {
    urls,
    data,
    user,
  };
};

module.exports = {
  getResources,
};
