const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Local = require('../models/local.model')
const createError = require('http-errors');
const User = require("../models/User.model");


const cloudinary = require('cloudinary').v2;

const LOCALS_PER_PAGE = 6;

module.exports.list = (req, res, next) => {
  const { type, page = 1 } = req.query;
  const currentPage = Number(page);

  const query = {};

  if (type) {
    query.type = type;
  }
  
    console.log(query);
    Local.find(query)
      .sort({ createdAt: 'descending' })
      .limit(LOCALS_PER_PAGE)
      .skip(LOCALS_PER_PAGE * (currentPage - 1))
      .populate('owner')
      .then(locals => {
        const viewQuery = {
            type,
            hasFilter: [type].some(param => param)
        };
  
        return Local.count(query)
          .then(count => {
            const user = req.user
            const maxPages = count / LOCALS_PER_PAGE
            console.log(maxPages)
            res.render(
              'local/list',
              {
                locals,
                user,
                query: viewQuery,
                nextPage: currentPage >= maxPages ? null : currentPage + 1,
                previousPage: currentPage > 1 ? currentPage - 1 : null
              }
            )
          })
  
      })
      .catch(next)
}


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
      const user = req.user
        local.location = formatCoordinates(JSON.parse(local.location))
        res.render('local/detail', { 
            local,
            user,
            isBar: local.type === "Bar",
            isRestaurant: local.type === "Restaurant",
            isCafeteria: local.type === "Cafeteria"
         })
    })
    .catch(err => {
        console.error(err)
    })
}


module.exports.create = (req, res, next) => {
  const user = req.user
    res.render('local/new', {
      user
    });
};


module.exports.doCreate = (req, res, next) => {
  const user = req.user;
  const renderWithErrors = (errors) => {
      res.render('local/new', {
          local: req.body,
          user,
          errors
      });
  };

  const data = {
      ...req.body,
      owner: req.user._id,
      image: req.file ? req.file.path : undefined,
  };

  // Crear el local y obtener su ID
  Local.create(data)
      .then(local => {
          // Asociar el local al propietario
          User.findByIdAndUpdate(req.user._id, { $push: { locals: local._id } })
              .then(() => {
                  res.redirect('/locals');
              })
              .catch(err => {
                  next(err);
              });
      })
      .catch(err => {
          if (err instanceof mongoose.Error.ValidationError) {
              console.log(err);
              renderWithErrors(err.errors);
          } else {
              next(err);
          }
      });
};

module.exports.editFormGet = (req, res, next) => {
    const { id } = req.params;
    const user = req.user
    Local.findById(id)
    .then(local => {
      res.render('local/edit', { 
        local,
        user,
        isEdit: true });
    })
    .catch(err => next(err));
};



module.exports.formPost = (req, res, next) => {
  const { id } = req.params;
  const { image } = req.file; // Nueva imagen, si se proporcionó
  const data = {
    ...req.body,
    owner: req.user._id,
    image: req.file ? req.file.path : undefined,
    //location: JSON.parse(req.body.location),
}

  // Si se proporcionó una nueva imagen, actualiza la propiedad 'image' en 'updateData'
  if (image) {
      updateData.image = image.url; // Usa la URL de la imagen proporcionada por Cloudinary
  }

  Local.findByIdAndUpdate(id, data, { new: true })
      .then(local => {
          res.redirect(`/locals/${local._id}`);
      })
      .catch(err => next(err));
};