require('dotenv').config();

const faker = require('faker');
const mongoose = require('mongoose');
const locals = require('../data/locals.json');
const Local = require('../models/local.model');
const Event = require('../models/event.model');

require('../config/db.config');

mongoose.connection.once('open', () => {
  console.info(`*** Connected to the database ${mongoose.connection.db.databaseName} ***`);

  mongoose.connection.db
    .dropDatabase()
    .then(() => console.log(`- Database dropped`))
    .then(() => {
      locals.forEach((local) => {
        new Local({
          ...local,
          type: ['Restaurant', 'Bar', 'Cafeteria'],
          description: faker.lorem.sentence(),
          capacity: Math.floor(Math.random() * 100 + 10),
        })
          .save()
          .then((local) => {
            for (let i = 0; i < 10; i++) {
              const event = new Event({
                name: faker.address.city(),
                description: [],
                cost: Math.random() * 20,
                image: faker.image.food(),
                local: local._id,
              });

              event
                .save()
                .then((event) => {
                  console.log(`Event ${event.name} for ${local.name}`);
                })
                .catch(console.error);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      });
    })
    .catch((error) => console.error(error));
});