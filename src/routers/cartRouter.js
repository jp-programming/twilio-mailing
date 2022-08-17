const cartRouter = require('express').Router();
const MongoCart = require('../lib/MongoCartContainer');
const logger = require('../lib/logger');

const { sendCheckoutEmail } = require('../lib/mailer');
const { sendWSMessage, sendTextMessage } = require('../lib/textMessage');
const cart = new MongoCart();

cartRouter.get('/', (req, res) => {
    logger('info', `${req.method} ${req.originalUrl}`);
    const user = {
        name,
        age,
        address,
        phone,
        email
    } = req.user;
    
    res.render('cart', user);
});

cartRouter.get('/checkout', async (req, res) => {
    logger('info', `${req.method} ${req.originalUrl}`);
    const user = {
        name,
        phone,
        email
    } = req.user;

    const dbCart = await cart.getAll(user.email);
    if(dbCart.products.length) {
        const info = {
            name: user.name,
            email: user.email,
            products: dbCart.products,
            total: dbCart.total
        };
    
        sendCheckoutEmail(info);
        sendWSMessage(info);
        sendTextMessage(user.phone);

        await cart.clearCart(info.email);
        res.redirect('/app/cart');
    } else res.redirect('/app');
});

module.exports = {
    cartRouter
};