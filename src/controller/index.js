import express from 'express';

const router = express.Router();

const whitelist = ['/', '/signin', '/signup'];

router.get('*', checkAuthentication, function (req, res, next) {
    if (req.user) {
        res.render('pages/index', { user: req.user });
    } else {
        res.render('pages/index', { user: null });
    }
});

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated() || whitelist.indexOf(req.originalUrl) > -1) {
        next();
    } else {
        res.redirect("/signin");
    }
}

export default router;
