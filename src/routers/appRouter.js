const { auth } = require('../middlewares/auth');
const { cartRouter } = require('./cartRouter');
const logger = require('../lib/logger');
const appRouter = require('express').Router();
const passport = require('passport');
const LocalStrorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStrorage('./localStorage');

appRouter.get('/', auth, (req, res) => {
    logger('info', `${req.method} ${req.originalUrl}`);
    const user = {
        name,
        age,
        address,
        phone,
        email
    } = req.user;

    localStorage.setItem('email', JSON.stringify(user.email));
    res.render('main', user);
});

appRouter.get('/register', (req, res) => {
    logger('info', `${req.method} ${req.originalUrl}`);
    if( req.isAuthenticated() ) res.redirect('/app');
    else res.render('register');
});

appRouter.post('/registerAuth', passport.authenticate('register', 
    { failureRedirect: '/app/register-error', successRedirect: '/app/login' }
));

appRouter.get('/register-error', (req, res) => {
    res.render('register-error');
});

appRouter.get('/login', (req, res) => {
    logger('info', `${req.method} ${req.originalUrl}`);
    if( req.isAuthenticated() ) res.redirect('/app');
    else res.render('login');
});

appRouter.post('/loginAuth', passport.authenticate('login', 
    { failureRedirect: '/app/login-error', successRedirect: '/app' }
));

appRouter.get('/login-error', (req, res) => {
    res.render('login-error');
});

appRouter.get('/logout', (req, res) => {
    logger('info', `${req.method} ${req.originalUrl}`);
    req.logout(err => {
        res.redirect('/app/login')
        localStorage.removeItem('email');
    });
});

appRouter.get('/products-test', (req, res) => {
    logger('info', `${req.method} ${req.originalUrl}`);
    res.render('productsTest')
});

appRouter.use('/cart', auth, cartRouter);

module.exports = appRouter;