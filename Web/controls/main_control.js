/**
 * @module controls/mainControl
 * @requires module:db/mysqlMapper
 */

var mysqlMapper = require('../db/mysql_mapper');

exports.index = function(req, res) {
	var users = mysqlMapper.getAllUsers(function(rows){
		console.log(rows);
		res.render('about', {
			developers : rows
		});
	});
//	res.send('Hello World!');
};
