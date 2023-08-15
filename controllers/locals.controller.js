const mongoose = require('mongoose');
const Local = require('../models/local.model')
const createError = require('http-errors');

const LOCALS_PER_PAGE = 4;

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