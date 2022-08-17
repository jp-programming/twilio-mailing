const auth = (req, res, next) => {
    if (req.isAuthenticated()) next(); 
    else res.redirect('/app/login');
}

module.exports = {
    auth
};