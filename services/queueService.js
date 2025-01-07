const { connect } = require('amqplib')

async function send(processData = {}) {
  try {
    console.log(processData);
  } catch (error) {
    console.warn('Error sending data on queue:', error);
  }
}

module.exports = { send };