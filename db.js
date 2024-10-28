const mongoose = require('mongoose');

async function initializeDatabase() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Connected to MongoDB');
  await mongoose.connection.asPromise();
  const db = mongoose.connection.db;
  const collections = await db.listCollections({ name: 'readings' }).toArray();

  if (collections.length === 0) {
    console.log('Creating time-series collection: Readings');
    await db.createCollection('readings', {
      timeseries: {
        timeField: 'timestamp',
        metaField: 'device',
        granularity: 'minutes',
      },
    });
  } else {
    console.log('Time-series collection "Readings" already exists');
  }
}

module.exports = initializeDatabase;