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
let sha1 = require('sha1');
let session = require('express-session');

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

//Port
app.listen(5000);