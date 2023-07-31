const passport = require('passport');
const mongoose = require ('mongoose');
const User = require ('../models/User.model')
const LocalStrategy = require ('passport-local').Strategy;

passport.serializeUser ( (user, next) => {
    next (null, user._id);
});

passport.deserializeUser ((id, next) => {
    User.findById(id)
    .then(user => next (null, user))
    .catch (err => next(err))
});

passport.use(
    'local-auth',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        (email, password, next) => {
            User.findOne({ email })
            .then(user => {
                if (!user) {
                    next (null, null, { email: 'Invalid email or password'})
                } else {
                    return user.checkPassword(password)
                    .then(match => {
                        if (!match){
                            next(null, null, { email: 'Invalid email or password'})
                        } else {
                            next(null, user);
                        }
                    })
                }
            })
            .catch(err => next (next))
        }
    )
)

