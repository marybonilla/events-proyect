const mongoose = require('mongoose');
const Event = require('../models/event.model')
const createError = require('http-errors');
const Local = require('../models/local.model');


module.exports.listEvent = (req, res, next) => {
  const user = req.user
    Event.find()
    .sort({ createdAt: 'descending' })
    .populate('local')
    .then(events => {
        res.render('event/list', { events, user });
    })
    .catch(err => next(err));
};

module.exports.createEvent = (req, res, next) => {
  const user = req.user
    res.render('event/form-event', { user });

}

module.exports.doCreateEvent = (req, res, next) => {

    const renderWithErrors = (errors) => {
        res.render('event/form-event', {
          event: req.body,
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
    Event.create(data)
    .then(event => {
    
        res.redirect('/events');
      })
    .catch(err => {
      if (err instanceof mongoose.Error.ValidationError) {
        console.log(err)
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    })
}

module.exports.detailEvent = (req, res,  next) => {
    const { id } = req.params;
    const user = req.user
    
    function formatCoordinates(coordinates) {
        console.log(coordinates)
        if (coordinates.length !== 2) {
            return "Invalid coordinates";
        }
        
        const formattedString = `${coordinates[0]}, ${coordinates[1]}`;
        console.log(formattedString);
        return formattedString;
    }
    

  Event.findById(id)
    .populate ('local')
    .then(event => {
        event.location = formatCoordinates(JSON.parse(event.location))
      res.render('event/event-detail', { event, user } )
    })
    .catch(err => next(err));
}


module.exports.editFormEvent = (req, res, next) => {
    const { id } = req.params;
    const user = req.user
    Event.findById(id)
    .then(event => {
      res.render('event/event-edit', { 
        event,
        user,
        isEdit: true });
    })
    .catch(err => next(err));
}


module.exports.postFormEvent = (req, res, next) => {
    const { id } = req.params;
    console.log(req.body);
    Event.findByIdAndUpdate(id, req.body, { new: true })
    .then(event => {
      res.redirect(`/events/${event._id}`);
    })
    .catch(err => next(err))

}