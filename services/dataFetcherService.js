const brewRepository = require('../repositories/brewtrollerRepository');
const dataProcessor = require('./dataProcessor');

async function syncData(try_number = 0) {
  try {
    const statusData = await brewRepository.fetchStatus('a'); // 'a' is BTCMD_GetStatus code
    await dataProcessor.processStatusData(statusData);
  } catch (error) {
    console.warn('Error during data synchronization:', error);
    if(try_number > 3) return;
    syncData(try_number += 1);
  }
}

module.exports = { syncData };