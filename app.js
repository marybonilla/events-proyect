require ('dotenv').config();

const express = require('express');
const logger = require('monga');
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


// Middlewares




// Routes