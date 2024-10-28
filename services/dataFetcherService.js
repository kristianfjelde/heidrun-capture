const brewRepository = require('../repositories/brewtrollerRepository');
const dataProcessor = require('./dataProcessor');

async function syncData() {
  try {
    const statusData = await brewRepository.fetchStatus('a'); // 'a' is BTCMD_GetStatus code
    await dataProcessor.processStatusData(statusData);
    console.log('Sync completed');
  } catch (error) {
    console.error('Error during data synchronization:', error);
  }
}

module.exports = { syncData };