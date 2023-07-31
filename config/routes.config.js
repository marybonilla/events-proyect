const router = require('express').Router();
const miscController = require ('../controllers/misc.controller');
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/users.controller');

router.get('/' , miscController.getHome);

// Auth

router.get('/register', authController.register);
router.post('/register', authController.doRegister);

router.get('/login', authController.login);
router.post('/login', authController.doLogin);


module.exports = router;