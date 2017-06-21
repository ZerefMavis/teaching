/**
* @file
* @brief	Module allowing the connection and the disconnection 
* @author	Yoan Habib <y.habib@intech-so.fr>
*/

/**
* Connection for a user or administrator
* @param 	array	key			array which contains keys for the statement
* @param 	/		db			module database
* @param 	string	role		determines whether it is the connection for an administrator or a user
* @param 	/		callback	callback function which is called with the connection and username variable as parameters
*/
exports.connection = function(key, db, definedRole, callback) {
	let statement = "SELECT USERNAME, LABEL FROM user INNER JOIN role ON user.IK_ROLE = role.ID_ROLE WHERE USERNAME = ? AND PASS = ?";
	let connection = false; 
	let username = undefined;
	let role = undefined;

	db.sqlSelect(statement, key, (rows) => {
		if(rows.length !== 0 && rows[0].LABEL === definedRole) {
			connection = true;
			username = rows[0].USERNAME;
			role = rows[0].LABEL;
		}
		callback(connection, username, role);
	});
}

/**
* Diconnection for a user or administrator
* @param 	/		request		request	got by the server
* @param 	/		session		module session
*/
exports.disconnection = function(request, session) {
	request.session.destroy((err) => {
		if(err) throw err;
	});
}

/**
* Check if a user or an administrator is logged
* @param 	/		request		request	got by the server
* @param 	/		session		module session
* @param 	/		db			module database
* @param 	/		callback	callback function which is called with the log variable as parameter
*/
exports.isLogged = function(request, session, db, callback) {
	let username = request.session.username;
	let role = request.session.role;
	let log = false;

	if(username !== undefined && role !== undefined) {
		let statement = "SELECT USERNAME, LABEL FROM user INNER JOIN role ON user.IK_ROLE = role.ID_ROLE WHERE USERNAME = ? AND LABEL = ?";
		let key = [username, role];

		db.sqlSelect(statement, key, (rows) => {
			if(rows.length !== 0) {
				log = true;
			} 
			callback(log);
		});
	} else {
		callback(log);
	}
}