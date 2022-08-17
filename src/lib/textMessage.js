const twilio = require('twilio');
const logger = require('./logger');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountSid, authToken);

const sendTextMessage = async (phoneNumber) => {
    const options = {
        body: 'Tu pedido fue recibido, te contactaremos para confirmarlo',
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
    };

    try {
        const message = await client.messages.create(options);
        logger('info', `Message sent: ${message.sid}`);
    } catch (error) {
        logger('error', error);
    }
};

const sendWSMessage = async (data) => {
    const productsText = data.products
        .map(product => `_${product.name} ${product.quantity} x ${Number((product.subTotal / product.quantity).toFixed(2))}_`).join('\n');

    const body = `*Nuevo pedido de ${data.name} - ${data.email}* \nLista de productos: \n${productsText} \n*Total: ${data.total}*`;

    const options = {
        body,
        from: `whatsapp:+14155238886`,
        to: `whatsapp:${process.env.ADMIN_NUMBER}`,
    };

    try {
        const message = await client.messages.create(options);
        logger('info', `Message sent: ${message.sid}`);
    } catch (error) {
        logger('error', error);
    }
};

module.exports = {
    sendWSMessage,
    sendTextMessage
};