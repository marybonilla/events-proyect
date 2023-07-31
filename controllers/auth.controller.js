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

// hacer el login 

module.exports.login = (req, res, next) => {
    res.render ('auth/login');
}

module.exports.doLogin = (req, res, next) => {
    const passportController = passport.authenticate ('local-aouth', (err, user, validations) =>{
        if (error) {
            next (error)
        }else if (!user) {
            res.render ('auth/login' , {
                user: req.body,
                errors: validations
            })
        } else {
            req.login(user, error => {
                if (error) {
                    next (error)
                } else {
                    res.redirect ('/profile')
                }
            })
        }
    })

    passportController(req, res, next);
}
