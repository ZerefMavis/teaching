/**
* @file
* @brief	Server of the project
* @author	Yoan Habib <y.habib@intech-so.fr>
*/

"use strict";

//Modules
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let htmlspecialchars = require('htmlspecialchars');
let sha1 = require('sha1');
let session = require('express-session');

//Personal modules
let db = require('./modules/db');
let login = require('./modules/login');

//Set the template
app.set('view engine', 'ejs');

//Middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
	secret: 'yh1997sao2703',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));

/****************************************************/
app.use((request, response, next) => {
	login.isLogged(request, session, db, (log) => {
		if(log && request.path === "/admin" && (request.method === "GET" || request.method === "POST")) {
			response.redirect('/admin/home');
		} else {
			next();
		}
	});
});

app.use((request, response, next) => {
	login.isLogged(request, session, db, (log) => {
		if(!log && request.path !== "/admin" && request.path !== "/") {
			if(request.path.substr(0,6) === "/admin") {
				response.redirect('/admin');
			} else {
				response.redirect('/');
			}
		} else {
			next();
		}
	});
});
/****************************************************/

//Router
app.route('/admin')
	.get((request, response) => {
		if(request.query.code && request.query.code === "0") {
			response.render('./admin/index', { code : "0" });
		} else {
			response.render('./admin/index');
		}
	})	
	.post((request, response) => {
		let username = htmlspecialchars(request.body.username);
		let password = htmlspecialchars(sha1(request.body.password));
		let key = [username, password];

		login.connection(key, db, "admin", (connection, username, role) => {
			if(connection) {
				request.session.username = username;
				request.session.role = role;
				response.redirect('/admin/home');
			} else {
				response.redirect('/admin?code=0');
			}
		});
	});

app.get('/admin/home', (request, response) => {
	response.render('./admin/home', { path : "home" });
});

//Port
app.listen(5000);