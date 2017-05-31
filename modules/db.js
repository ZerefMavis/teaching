/**
* @file
* @brief	Module allowing the database connection and sql query execution
* @author	Yoan Habib <y.habib@intech-so.fr>
*/

let mysql = require('mysql');

//Configuration
let db = {
	host : "localhost",
	user : "root",
	password : "",
	database : "dbteaching"
};

/**
* open the connection to the database
*/
function openDb() {
	mySqlClient = mysql.createConnection(db);
	mySqlClient.connect((err) => {
		if(err) throw err;
	});
}

/**
* close the connection to the database
*/
function closeDb() {
	mySqlClient.end((err) => {
		if(err) throw err;
	});
}

/**
* Select request with or without parameters
* @param 	string	statement	select request
* @param 	array	key			array of parameters, it can be null
* @param 	/		callback	callback function which is called with the results as a parameter
*/
exports.sqlSelect = function(statement, key, callback) {
	openDb();
	mySqlClient.query(statement, key, (err, rows) => {
		if(err) {
			mySqlClient.query(statement, (err, rows) => {
				if(err) throw err;
				callback(rows);
			});
		}
		callback(rows);
	});
	closeDb();
}

/**
* Insert request
* @param 	string	statement	insert request
* @param 	object	key			object of parameters
*/
exports.sqlInsert = function(statement, key) {
	openDb();
	mySqlClient.query(statement, key, (err) => {
		if(err) throw err;
	});
	closeDb();
}

/**
* Insert request which get the id of the inserted element
* @param 	string	statement	insert request
* @param 	object	key			object of parameters
* @param 	/		callback	callback function which is called with the id as a parameter
*/
exports.sqlInsertGetId = function(statement, key, callback) {
	openDb();
	mySqlClient.query(statement, key, (err, result) => {
		if(err) throw err;
		callback(result.insertId);
	});
}