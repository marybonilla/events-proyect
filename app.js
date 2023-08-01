require ('dotenv').config();

const express = require('express');
const logger = require('morgan');
const path = require('path');
const createError = require ('http-errors');
const passport = require('passport');

const app = express();

// Config

require('./config/db.config');
require('./config/hbs.config');
require('./config/passport.config');
const session = require('./config/session.config');



// Views

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;

  next();
});



// Routes


const routes = require('./config/routes.config');
app.use(routes);

app.use((req, res, next) => {
    next(createError(404, 'Page not found'));
  })

app.use((error, req, res, next) => {
  console.error(error);

  const status = error.status || 500;

  res.status(status).render('error', {
    message: error.message,
  })
})

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`App started on port ${port}`);
})