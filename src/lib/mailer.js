const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD
    }
});

const sendRegisterEmail = async (data) => {
    const mailOptions = {
        from: 'Nodejs app',
        to: process.env.ADMIN_EMAIL,
        subject: 'Nuevo registro de usuario',
        html: `
            <h1>Nuevo registro de usuario</h1>
            <div class="register-mail">
                <p>Nombre: ${data.name}</p>
                <p>Edad: ${data.age}</p>
                <p>Dirección: ${data.address}</p>
                <p>Teléfono: ${data.phone}</p>
                <p>Email: ${data.email}</p>
            </div>
        `
    };

    await transport.sendMail(mailOptions);
};

const sendCheckoutEmail = async (data) => {
    const mailOptions = {
        from: 'Nodejs app',
        to: process.env.ADMIN_EMAIL,
        subject: `Nuevo pedido de ${data.name} - ${data.email}`,
        html: `
            <h1>Lista de productos</h1>
            <ul>
                ${data.products.map(product => `
                    <li>${product.name} ${product.quantity} x ${Number((product.subTotal / product.quantity).toFixed(2))} </li>`
                ).join('')}
            </ul>
            <h3>Total: ${data.total}</h3>
        ` 
    };

    await transport.sendMail(mailOptions);
};

module.exports = {
    sendRegisterEmail,
    sendCheckoutEmail
}
