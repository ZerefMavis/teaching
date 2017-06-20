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
exports.connection = function(key, db, role, callback) {
	let statement = "SELECT USERNAME, LABEL FROM user INNER JOIN role ON user.IK_ROLE = role.ID_ROLE WHERE USERNAME = ? AND PASS = ?";
	let connection = false; 
	let username = undefined;

	db.sqlSelect(statement, key, (rows) => {
		if(rows.length !== 0 && rows[0].LABEL === role) {
			connection = true;
			username = rows[0].USERNAME;
		}
		callback(connection, username);
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