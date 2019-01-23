const schedule = require('node-schedule');

const config = require('../config');
const { postHandler } = require('./handler');

const rule = new schedule.RecurrenceRule();
rule.minute = 30;

module.exports = () => {
  console.log('schedule start');
  schedule.scheduleJob(rule, () => {
    for (let uid of config.subscribeUsers) {
      postHandler({ uid, aria2: false });
    }
  });
};
