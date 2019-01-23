const schedule = require('node-schedule');

const config = require('../config');
const { postHandler } = require('./handler');
const db = require('./database');

const rule = new schedule.RecurrenceRule();
rule.minute = 30;

db.client.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('schedule start');
  schedule.scheduleJob(rule, () => {
    for (let uid of config.subscribeUsers) {
      postHandler({ uid, aria2: false });
    }
  });
});
