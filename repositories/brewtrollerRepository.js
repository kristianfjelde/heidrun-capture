const http = require('http');
const { config } = require('../config');
const { BTCMD_GetStatus } = require('../lib/cgiByteCodeMap');

class BrewtrollerRepository {
  constructor() {
    this.url = config.url;
  }

  fetchStatus(code) {
    return new Promise((resolve, reject) => {
      if (config.useMockData) {
        // Generate mock data
        const sampleResponse = this.generateMockData();

        const status = {};
        BTCMD_GetStatus().rspParams.forEach((param, i) => {
          status[param] = sampleResponse[i];
        });

        resolve(status);
      } else {
        // Original HTTP request code
        http.get(`${this.url}?${code}`, (resp) => {
          let data = '';
          resp.on('data', (chunk) => {
            data += chunk;
          });

          resp.on('end', () => {
            const parsedData = JSON.parse(data);
            const status = {};
            BTCMD_GetStatus().rspParams.forEach((param, i) => {
              status[param] = parsedData[i];
            });
            resolve(status);
          });
        }).on('error', (err) => {
          reject(err);
        });
      }
    });
  }

  generateMockData() {
    // Base sample data
    const sampleResponse = [
      'a',
      '0',
      '0',
      '44081160', // Profile Status
      '252', // Output Status
      '5000', // HLT_Setpoint
      '2175', // HLT_Temperature // 6
      '100', // HLT_HeatPower
      '0', // HLT_TargetVolume
      '13107', // HLT_Volume
      '0',
      '6600', // Mash_Setpoint
      '2193', // Mash_Temperature // 12
      '100', // Mash_HeatPower
      '0',
      '0',
      '0',
      '10000', // Kettle_Setpoint
      '2200', // Kettle_Temperature // 18
      '100', // Kettle_HeatPower
      '0',
      '0',
      '0',
      '4294934528',
      '4294934528',
      '2200', // WortOut_Temperature
      '2200', // AUX1_Temperature
      '4294934528',
      '4294934528',
      '0',
      '0',
      '0',
      '0',
      '0',
      '255',
      'SANITY ALE',
      '0',
      '255',
      '',
      '255',
    ];

    // Modify some values to change slightly each time
    sampleResponse[6] = (2175 + Math.floor(Math.random() * 5000)).toString(); // HLT_Temperature
    sampleResponse[12] = (2193 + Math.floor(Math.random() * 5000)).toString(); // Mash_Temperature
    sampleResponse[18] = (2200 + Math.floor(Math.random() * 5000)).toString(); // Kettle_Temperature

    // Modify outputStatus to simulate devices turning on/off
    sampleResponse[4] = Math.floor(Math.random() * 1024).toString(); // outputStatus

    return sampleResponse;
  }
}

module.exports = new BrewtrollerRepository();