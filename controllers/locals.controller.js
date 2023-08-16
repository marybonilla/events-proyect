const mongoose = require('mongoose');
const Local = require('../models/local.model')
const createError = require('http-errors');

const LOCALS_PER_PAGE = 16;

module.exports.list = (req, res, next) => {
    const { restaurant, bar, cafeteria, page = 1 } = req.query;
  
    const currentPage = Number(page);
  
    const query = {};
  
    if (restaurant) {
      query.restaurant = restaurant;
    }
    if (bar) {
      query.bar = bar;
    }
    if (cafeteria) {
        query.cafeteria = cafeteria;
      }
  
    Local.find(query)
      .sort({ createdAt: 'descending' })
      .limit(LOCALS_PER_PAGE)
      .skip(LOCALS_PER_PAGE * (currentPage - 1))
      .populate('owner')
      .then(locals => {
        const viewQuery = {
            restaurant,
            bar,
            cafeteria,
          hasFilter: restaurant || bar || cafeteria
        
        };
  
        return Local.count(query)
          .then(count => {
            const maxPages = count / LOCALS_PER_PAGE
  
            console.log(maxPages)
            res.render(
              'local/list',
              {
                locals,
                query: viewQuery,
                nextPage: currentPage >= maxPages ? null : currentPage + 1,
                previousPage: currentPage > 1 ? currentPage - 1 : null
              }
            )
          })
  
      })
      .catch(next)
}


module.exports.create = (req, res, next) => {
    res.render('local/new', {});
};


module.exports.doCreate = (req, res, next) => {
    const renderWithErrors = (errors) => {
        res.render('local/new', {
          local: req.body,
          errors
        })
    }
   

    const data = {
        ...req.body,
        owner: req.user._id,
        image: req.file ? req.file.path : undefined,
        //location: JSON.parse(req.body.location),
    }
    console.log(req.body)
    console.log("Controlador doCreate llamado");
    Local.create(data)
    .then(local => {
        console.log("Local creado exitosamente:", local);
        res.redirect('/locals');
      })
    .catch(err => {
      if (err instanceof mongoose.Error.ValidationError) {
        console.log(err)
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    })




};