// Tie routes to controllers

import express from 'express';
import fileUpload from 'express-fileupload';
import index from './controller/index';
import api from './controller/api';
import env from 'dotenv';
import { User } from './model/database';
import socketserver from './sockets/socket-server.js';
import passport from 'passport';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser'
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt-nodejs';

let config = env.config();
let app = express();
let PORT = 8080;

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({ secret: 'oijahjewuihfnkdwoihfweoafox', resave: false, saveUninitialized: false }));
app.use(fileUpload());
app.use(express.static(process.cwd() + '/lib/view/public'));
app.use("/avatars", express.static(process.cwd() + '/avatars'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view');

const server = app.listen(PORT, () => {
	server.keepAliveTimeout = 0;
});

// passport
passport.use(new Strategy(function (username, pass, cb) {
	let hashedPass = bcrypt.hashSync(pass);
	User.findOne({
		where: {
			username: username
		}
	}).then(function (user, err) {
		if (err) { return cb(err); }
		if (!user) {
			return cb(null, false);
		}
		if (!bcrypt.compareSync(pass, user.password)) {
			return cb(null, false);
		}
		return cb(null, user);
	});
}));

passport.serializeUser(function (user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
	User.findById(id).then(function (user) {
		cb(null, user);
	});
});

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
	if (req.user) {
		res.locals.user = req.user.username;
		res.locals.userid = req.user.id;
	}
	next();
});

// routes for /api
app.use('/api', api);

// routes for all requests
app.use('*', index);

console.log('Listening on', PORT);
