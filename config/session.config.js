const expressSession = require ('express-session');
const mongoose = require ('mongoose');
const MongoStore = require ('connect-mongo');

const sessionMaxAgeDays = Number(process.env.SESSION_MAX_AGE_DAYS || 2);

module.exports = expressSession({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.SESSION_SECURE === 'true',
      maxAge: 24 * 3600 * 1000 * sessionMaxAgeDays,
    },
    store: MongoStore.create({
      mongoUrl: mongoose.connection._connectionString,
      ttl: 24 * 3600 * sessionMaxAgeDays,
    })
  });