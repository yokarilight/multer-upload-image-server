const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, { "dbName": process.env.DATABASE_COLLECTION_DB_NAME })
  .then(() => {
    console.log('connect db successfully')
  }).catch((err) => {
    console.log(err);
  });
