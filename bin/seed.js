require('dotenv').config();


const mongoose = require('mongoose');
const locals = require('../data/locals.json');
const Local = require('../models/local.model');
const Event = require('../models/event.model');

require('../config/db.config');

mongoose.connection.once('open', () => {
  console.info(`*** Connected to the database ${mongoose.connection.db.databaseName} ***`);

  mongoose.connection.db
        .dropDatabase()
        .then(() => {
      return Local.create(locals)
    })
    .then(localDB => {
      localDB.forEach(local => {
        console.log(`${local.name} has been created`)
      })

      console.log(`${localDB.length} local have been created`);
    })
    .catch(err => console.error(err))
    .finally(() => {
      mongoose.disconnect();
    })
});