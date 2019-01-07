const koa = require('koa');
const Router = require('koa-router');
const db = require('./database');
const { postHandler } = require('./handler');
const config = require('../config');

const app = new koa();
const router = new Router();

router.post('/ifttt/weibo/:uid', async (ctx) => {
  ctx.body = { ok: 1 };
  postHandler({ uid: ctx.params.uid, aria2: true });
});

app
  .use(router.routes())
  .use(router.allowedMethods());

db.client.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  app.listen(config.serverPort || 3000);
  console.log(`Webhook server listened on :${config.serverPort || 3000}`);
});
