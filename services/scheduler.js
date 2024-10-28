const cron = require('node-cron');
const dataFetcherService = require('./dataFetcherService');

function startScheduler() {
  cron.schedule('*/15 * * * * *', () => {
    dataFetcherService.syncData();
  });
}

module.exports = { startScheduler };