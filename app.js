const express = require('express');
const initializeDatabase = require('./db');
const scheduler = require('./services/scheduler');


initializeDatabase().catch((err) => {
  console.error('Failed to initialize database: ', err);
});
const app = express();
scheduler.startScheduler(app);

const PORT = process.env.PORT || 3001;
server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = server