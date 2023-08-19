const router = require('express').Router();
const miscController = require ('../controllers/misc.controller');
const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');
const localsController = require('../controllers/locals.controller');
//const verificationsController = require('../controllers/verifications.controller');


const authMiddleware = require('../middlewares/auth.middleware');

const upload = require('./multer.config');
router.get('/' , miscController.getHome);

// Auth

router.get('/register',authMiddleware.isUnauthenticated, authController.register);
router.post('/register',authMiddleware.isUnauthenticated, upload.single('avatar'), authController.doRegister);

router.get('/login',authMiddleware.isUnauthenticated, authController.login);
router.post('/login',authMiddleware.isUnauthenticated, authController.doLogin);

router.get('/logout', authMiddleware.isAuthenticated, authController.logout);

// rutas para google 
router.get('/login/google', authMiddleware.isUnauthenticated, authController.loginGoogle);
router.get('/authenticate/google/cb', authMiddleware.isUnauthenticated, authController.doLoginGoogle);



router.get('/profile', authMiddleware.isAuthenticated, usersController.profile);
router.get('/profile/:id', authMiddleware.isAuthenticated, usersController.getUserProfile);

/* Local */

router.get('/locals',authMiddleware.isAuthenticated, localsController.list);
router.post('/locals/create',authMiddleware.isAuthenticated, upload.single('image'), localsController.doCreate);
router.get('/locals/create',authMiddleware.isAuthenticated, localsController.create);
router.get('/locals/:id', authMiddleware.isAuthenticated, localsController.detail);
router.get('/locals/:id/edit', authMiddleware.isAuthenticated,localsController.editFormGet);


/* Verification */

// router.get('/artworks/:id/verifications', )
//router.post('/artworks/:id/verify', authMiddleware.isAuthenticated, verificationsController.create);

module.exports = router;