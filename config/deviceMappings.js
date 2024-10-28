const { devices } = require('../scripts/initialiseDevices');

module.exports = {
  temperatureMappings: {
    HLT_Temperature: devices[13].serialNumber,
    Mash_Temperature: devices[14].serialNumber,
    WortOut_Temperature: devices[15].serialNumber,
    Kettle_Temperature: devices[16].serialNumber,
    AUX1_Temperature: devices[17].serialNumber,
  },
  outputStatusMappings: {
    heatElements: {
      0: devices[0].serialNumber,
      1: devices[1].serialNumber,
    },
    pumps: {
      0: devices[2].serialNumber,
      1: devices[3].serialNumber,
      2: devices[4].serialNumber,
    },
    valves: {
      0: devices[5].serialNumber,
      1: devices[6].serialNumber,
      2: devices[7].serialNumber,
      3: devices[8].serialNumber,
      4: devices[9].serialNumber,
      5: devices[10].serialNumber,
      6: devices[11].serialNumber,
      7: devices[12].serialNumber,
    },
  },
};