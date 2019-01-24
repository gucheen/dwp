const schedule = require('node-schedule');

const { postHandler } = require('./handler');

const rule = new schedule.RecurrenceRule();
rule.minute = 30;

module.exports = () => {
  console.log('schedule start');
  schedule.scheduleJob(rule, () => {
    const config = require('../config');
    console.log((new Date()).toISOString, ' [run schedule]');
    for (let uid of config.subscribeUsers) {
      postHandler({ uid, aria2: false });
    }
  });
};
