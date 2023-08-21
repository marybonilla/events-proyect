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

/*
module.exports.detail = (req, res, next) => {
    Local.findById(req.params.id)
      .populate('verifications')
      .then(local => {
        const positiveVerifications = local.verifications.filter(verification => verification.validation).length;
        const negativeVerifications = local.verifications.filter(verification => !verification.validation).length;
  
        const userVerification = local.verifications.find(verification => verification.user.toString() === req.user._id.toString());
        const userPositive = userVerification && userVerification.validation === true;
        const userNegative = userVerification && userVerification.validation === false;
  
        if (local) {
          return Local.find({ type: local.type, _id: { $not: { $eq: local._id } } })
            .limit(3)
            .sort({ createdAt: 'desc' })
            .then((relatedLocals) => {
              res.render(
                'local/detail',
                { 
                  local, positiveVerifications,
                  negativeVerifications, userPositive,
                  userNegative, relatedLocals
                }
              );
            })
        } else {
          next(createError(404, 'Local not found'));
        }
      })
      .catch(next)
  }*/


  module.exports.detail = (req, res, next) => {
    const { id } = req.params

    function formatCoordinates(coordinates) {
        //console.log(coordinates)
        if (coordinates.length !== 2) {
            return "Invalid coordinates";
        }
        
        const formattedString = `${coordinates[0]}, ${coordinates[1]}`;
        return formattedString;
    }

    Local.findById(id)
    .populate ('owner')
    .then(local => {
        local.location = formatCoordinates(JSON.parse(local.location))
        res.render('local/detail', { 
            local,
            isBar: local.type === "bar",
            isRestaurant: local.type === "restaurant",
            isCafeteria: local.type === "cafeteria"
         })
    })
    .catch(err => {
        console.error(err)
    })
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
    //console.log("Controlador doCreate llamado");
    Local.create(data)
    .then(local => {
        //console.log("Local creado exitosamente:", local);
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

module.exports.editFormGet = (req, res, next) => {
    const { id } = req.params;
    Local.findById(id)
    .then(local => {
      res.render('local/edit', { 
        local,
        isEdit: true });
    })
    .catch(err => next(err));
};

module.exports.formPost = (req, res, next) => {
    const { id } = req.params;
    console.log(req.body);
    Local.findByIdAndUpdate(id, req.body, { new: true })
    .then(local => {
      res.redirect(`/locals/${local._id}`);
    })
    .catch(err => next(err))
};

