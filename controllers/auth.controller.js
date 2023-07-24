const User = require('../models/User.model');
const mongoose = require ('mongoose');
const passport = require ('passport');

module.exports.register = (req, res, next) => {
    res.render('auth/register');
}

module.exports.doRegister = (req, res, next) => {
    const { email } = req.body

    const renderWithErrors = (errors) => {
        res.render('auth/register', {
            user : req.body,
            errors
        })
    }
    // confirmar si hay ya un usuario en la bd con ese email

    User.findOne({ email })
        .then (user => {
            if (user){
                renderWithErrors ({ email : 'Email already in use'});
            }   else {
                return User.create( req.body)
                    .then(() => {
                        res.redirect('/login')
                    })
            }
    })
    .catch(err => {
        if(err instanceof mongoose.Error.ValidationError){
            renderWithErrors (err.errors);
        } else{
            next(err)
        }
    })
}


