const router = require('express').Router();
const miscController = require ('../controllers/misc.controller');
const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');
const localsController = require('../controllers/locals.controller');
const eventsController = require('../controllers/events.controller');
const likesController = require ('../controllers/likes.controller');
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

router.get('/locals/:id/edit', authMiddleware.isAuthenticated,localsController.editFormGet);
router.post('/locals/:id/edit', authMiddleware.isAuthenticated, upload.single('image'),localsController.formPost);

router.get('/locals/:id', authMiddleware.isAuthenticated, localsController.detail);

/* Event */

router.get('/events', authMiddleware.isAuthenticated, eventsController.listEvent);
router.get ('/events/create', authMiddleware.isAuthenticated, upload.single('image'), eventsController.createEvent);
router.post('/events', authMiddleware.isAuthenticated, upload.single('image'), eventsController.doCreateEvent);

router.get('/events/:id/edit', authMiddleware.isAuthenticated,eventsController.editFormEvent);
router.post('/events/:id/edit', authMiddleware.isAuthenticated, upload.single('image'), eventsController.postFormEvent);
router.get('/events/:id', authMiddleware.isAuthenticated, eventsController.detailEvent);

/* likes */

router.post("/likes/:userId/:eventId", authMiddleware.isAuthenticated, likesController.create);


/* Verification */

// router.get('/artworks/:id/verifications', )
//router.post('/artworks/:id/verify', authMiddleware.isAuthenticated, verificationsController.create);

module.exports = router;