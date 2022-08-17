require('dotenv').config();
const { pd } = require('./src/script');
const { createProducts } = require('./src/lib/fakerProducts');
const FirebaseContainer = require('./src/lib/FirebaseContainer');
const MongoCart = require('./src/lib/MongoCartContainer');
const appRouter = require('./src/routers/appRouter');
const randomRouter = require('./src/routers/randomRouter');
const { infoRouter, cpus} = require('./src/routers/infoRouter');
const logger = require('./src/lib/logger');

const compression = require('compression');
const parseArgs = require('minimist');
const express = require('express');
const session = require('express-session');
const cluster = require('cluster');
const passport = require('passport');
const LocalStrorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStrorage('./localStorage');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
require('./src/lib/passport');  
const MongoStore = require('connect-mongo');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const options = { alias: { p: "PORT", mode: "MODE"}, default: { PORT: process.env.PORT || 8080, MODE: "FORK" } };
const { PORT, MODE } = parseArgs(process.argv.slice(2), options);

if(MODE === 'CLUSTER' && cluster.isPrimary) {
    const numCpus = cpus().length;
    
    logger('info', `Cluster mode: ${numCpus} CPUs`);

    cluster.on('online', (worker) => {
        logger('info', `Worker ${worker.process.pid} is online`);
    });

    for(let i = 0; i < numCpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', worker => {
        logger('info', `Worker ${process.pid} terminado`);
        cluster.fork();
    });
} else {
    const advancedOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('./public'));
    app.use(session({
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
            mongoOptions: advancedOptions,
            ttl: 600
        }),
        secret: 'secretNotSecret',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(compression());
    app.use('/api/randoms', randomRouter);
    app.use('/info', infoRouter);

    app.set('views', './src/views');
    app.set('view engine', 'ejs');
    app.use('/app', appRouter);

    app.all('*', (req, res) => {
        logger('warn', `${req.method} ${req.originalUrl} not found`);
        res.status(404).send('404 Page Not found');
    });

    const chat = new FirebaseContainer('messages');
    const cart = new MongoCart();
    
    io.on('connection', async socket => {
        logger('info', 'Client connected');
        const email = JSON.parse(localStorage.getItem('email'));

        socket.emit('products', await pd.getAll());
        socket.emit('messages', await chat.getAll());
        socket.emit('productsTest', createProducts());
        socket.emit('cartItems', await cart.getAll(email));

        socket.on('new-product', async product => {
            await pd.insert(product);
            io.sockets.emit('products', await pd.getAll());
        });

        socket.on('new-message', async message => {
            await chat.save(message);
            io.sockets.emit('messages', await chat.getAll());
        });

        socket.on('cart', async product => {
            const info = { email, product };
            await cart.save(info)
            socket.emit('cartItems', await cart.getAll(email));
        });

        socket.on('removeItemCart', async id => {
            const info = { email, id };
            await cart.removeItemCart(info)
            socket.emit('cartItems', await cart.getAll(email));
        });
    });

    const server = httpServer.listen(PORT, () => logger('info', `Server started on port ${PORT}`));
    server.on('error', (err) => logger('error', err));
}