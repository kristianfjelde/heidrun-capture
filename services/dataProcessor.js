// services/dataProcessor.js
const { temperatureMappings, outputStatusMappings } = require('../config/deviceMappings');

function processStatusData(statusData) {
  return {...processContinuousData(statusData), ...processDiscreteData(statusData)};
}

function processContinuousData(statusData) {
  const readingMap = {};

  for (const field in temperatureMappings) {
    if (Number.isSafeInteger(statusData[field])) {
      readingMap[field] = parseInt(statusData[field], 10);
      continue;
    }
    readingMap[field] = statusData[field];
  }

  return readingMap;
}

function processDiscreteData(statusData) {
  const parsedOutputStatus = parseOutputStatus(statusData.outputStatus);
  const readingMap = {};

  // Process heat elements
  for (const [bitIndex, serialNumber] of Object.entries(outputStatusMappings.heatElements)) {
    const isActive = parsedOutputStatus.heatElements.includes(parseInt(bitIndex));
    readingMap[`Heater_${bitIndex}`] = isActive;
  }

  // Process pumps
  for (const [bitIndex, serialNumber] of Object.entries(outputStatusMappings.pumps)) {
    const isActive = parsedOutputStatus.pumps.includes(parseInt(bitIndex));
    readingMap[`Pump_${bitIndex}`] = isActive;
  }

  // Process valves
  for (const [bitIndex, serialNumber] of Object.entries(outputStatusMappings.valves)) {
    const isActive = parsedOutputStatus.valves.includes(parseInt(bitIndex));
    readingMap[`Valve_${bitIndex}`] = isActive;
  }

  return readingMap;
}

async function handleDiscreteState(serialNumber, currentState, readingsToSave) {
  const device = await Device.findOne({ serialNumber });

  if (device) {
      const readingToInsert = new Reading({
        device: device._id,
        time: new Date(),
        value: currentState,
        unit: device.unit, // Should be 'boolean' or appropriate unit
        dataType: device.dataType, // Should be 'state' or appropriate type
      })

      device.state = readingToInsert;
      await device.save();
      readingsToSave.push(readingToInsert);
  } else {
    console.warn(`Device with serial number ${serialNumber} not found`);
  }
}

function parseOutputStatus(outputStatus) {
  const heatElements = [];
  const pumps = [];
  const valves = [];

  // Parse heat elements (Bits 11-12)
  for (let i = 0; i < 2; i++) {
    if (outputStatus & (1 << (11 + i))) {
      heatElements.push(i);
    }
  }

  // Parse pumps (Bits 8-10)
  for (let i = 0; i < 3; i++) {
    if (outputStatus & (1 << (8 + i))) {
      pumps.push(i);
    }
  }

  // Parse valves (Bits 0-7)
  for (let i = 0; i < 8; i++) {
    if (outputStatus & (1 << i)) {
      valves.push(i);
    }
  }

  return { heatElements, pumps, valves };
}

module.exports = { processStatusData };