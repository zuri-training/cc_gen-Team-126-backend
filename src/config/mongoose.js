const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_KEY = process.env.MONGO_STRING;

const connect = () => {
  mongoose.connect(MONGO_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  database = mongoose.connection;
  database.on('error', (err) => {
    console.error(err);
    console.error(`Ooopss! An error Just Occurred!`);
  });

  database.once('connected', () => {
    console.info('Database now connected...');
  });
};

module.exports = connect;
