const cron = require('node-cron');
const dataFetcherService = require('./dataFetcherService');

function startScheduler() {
  cron.schedule('*/30 * * * * *', () => {
    dataFetcherService.syncData();
  });
}

module.exports = { startScheduler };