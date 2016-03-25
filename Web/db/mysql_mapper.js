

var mysql = require('mysql');

var connection = mysql.createConnection({
	host :'localhost',
	port : 3306,
	user : 'jinmoku',
	password : '1234',
	database:'web'
});

connection.connect(function(err) {
	if (err) {
		console.error('mysql connection error');
		console.error(err);
		throw err;
	}
});


exports.getAllUsers = function(callback) {
	var query = connection.query('select * from test', function(err, rows){
		callback(rows);
	});
}