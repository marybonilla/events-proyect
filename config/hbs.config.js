const hbs = require ('hbs');
const path = require ('path');
const dateFormat = require('handlebars-dateformat'); // Importa el helper dateFormat

hbs.registerPartials(path.join(__dirname, '../views', 'partials'))

// Registra el helper dateFormat en Handlebars
hbs.registerHelper('dateFormat', dateFormat);