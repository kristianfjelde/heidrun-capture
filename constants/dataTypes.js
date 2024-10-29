const DataTypes = {
  TEMPERATURE: 'temperature',
  PWM: 'pwm',
  LEVEL: 'level',
  STATE: 'state',
  PRESSURE: 'pressure',
  VOLUME: 'volume',
};

const Units = {
  CELSIUS: '°C',
  FAHRENHEIT: '°F',
  PERCENT: '%',
  BOOLEAN: 'boolean',
  PSI: 'psi',
  BAR: 'bar',
  LITERS: 'L',
  GALLONS: 'gal',
};

module.exports = { DataTypes, Units };