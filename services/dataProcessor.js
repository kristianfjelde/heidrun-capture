// services/dataProcessor.js
const Device = require('../models/device');
const Reading = require('../models/reading');
const RawReading = require('../models/rawData');

const { temperatureMappings, outputStatusMappings } = require('../config/deviceMappings');

async function processStatusData(statusData) {
  await processContinuousData(statusData);
  await processDiscreteData(statusData);

  // Add more processing functions here as needed
  try {
    const rawReading = new RawReading({time: new Date(), data: statusData});
    await rawReading.save();
  } catch (error) {
    console.debug('Error saving raw data:', error);
  }
}

async function processContinuousData(statusData) {
  const readingsToSave = [];

  for (const field in temperatureMappings) {
    const serialNumber = temperatureMappings[field];
    const value = statusData[field];

    // Fetch the device by serial number
    const device = await Device.findOne({ serialNumber });

    if (device) {
      readingsToSave.push(new Reading({
        device: device._id,
        time: new Date(),
        value,
        unit: device.unit,
        dataType: device.dataType,
      }));

      device.state = readingsToSave[readingsToSave.length - 1];
      await device.save()
    } else {
      console.warn(`Device with serial number ${serialNumber} not found`);
    }
  }

  if (readingsToSave.length > 0) {
    await Reading.insertMany(readingsToSave);
  }
}

async function processDiscreteData(statusData) {
  const parsedOutputStatus = parseOutputStatus(statusData.outputStatus);
  const readingsToSave = [];

  // Process heat elements
  for (const [bitIndex, serialNumber] of Object.entries(outputStatusMappings.heatElements)) {
    const isActive = parsedOutputStatus.heatElements.includes(parseInt(bitIndex));
    await handleDiscreteState(serialNumber, isActive, readingsToSave);
  }

  // Process pumps
  for (const [bitIndex, serialNumber] of Object.entries(outputStatusMappings.pumps)) {
    const isActive = parsedOutputStatus.pumps.includes(parseInt(bitIndex));
    await handleDiscreteState(serialNumber, isActive, readingsToSave);
  }

  // Process valves
  for (const [bitIndex, serialNumber] of Object.entries(outputStatusMappings.valves)) {
    const isActive = parsedOutputStatus.valves.includes(parseInt(bitIndex));
    await handleDiscreteState(serialNumber, isActive, readingsToSave);
  }

  if (readingsToSave.length > 0) {
    await Reading.insertMany(readingsToSave);
  }
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