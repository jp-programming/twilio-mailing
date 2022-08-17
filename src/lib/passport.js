const bcrypt = require('bcrypt');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const { sendRegisterEmail } = require('./mailer');

const MongoContainer = require('./MongoContainer');

const users = new MongoContainer();

passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email', passwordField: 'password' },
    async (req, email, password, done) => {
        const user = await users.getByEmail(email);

        if (user) return done(null, false, { message: 'User already exists' });

        return bcrypt.hash(password, 10, async (err, hash) => {
            if (err) return done(err);

            const userInfo = {
                name: req.body.name,
                age: req.body.age,
                address: req.body.address,
                phone: req.body.phone,
                email
            };

            sendRegisterEmail(userInfo);

            const _id = await users.save({ 
                ...userInfo,
                password: hash 
            });
            const user = { _id, email, password };

            return done(null, user);
        });
    }
));

passport.use('login', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
        const user = await users.getByEmail(email);
        
        if (!user) return done(null, false, { message: 'User not found' });

        return bcrypt.compare(password, user.password, (err, res) => {
            if (err) return done(err);
            if (!res) return done(null, false, { message: 'Wrong password' });

            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
    const user = await users.getById(_id);
    done(null, user);
});

