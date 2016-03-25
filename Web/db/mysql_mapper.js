

var mysql = require('mysql');

var connection = mysql.createConnection({
	host :'localhost',
	port : 3306,
	user : 'root',
	password : '',
	database:'web'
});

connection.connect(function(err) {
	if (err) {
		console.error('mysql connection error');
		console.error(err);
		throw err;
	}
});


exports.insertOrUpdateOnExist = function(user, callback) {
	var query = connection.query("INSERT INTO users (uid, nickName, email, phone, meteringDay, maxLimitUsageBill) VALUES " +
			"(?, ?, ?, ?, ?, ?) " +
			"ON DUPLICATE KEY UPDATE " +
			"nickName=?, " +
			"email=?, " +
			"phone=?, " +
			"meteringDay=?, " +
			"maxLimitUsageBill=?", [user.uid, user.nickName, user.email, user.phone, user.meteringDay, user.maxLimitUsageBill, user.nickName, user.email, user.phone, user.meteringDay, user.maxLimitUsageBill], function(err, result){
		callback(err, result);
	});
}

exports.getNextReceiver = function(callback) {
	var query = connection.query('SELECT * FROM receiver_list ORDER BY total_amount_received, last_time_received ASC LIMIT 1', function(err, result){
		callback(result);
	});
}

exports.addToReceiverList = function(uid, callback) {
	var receiver = {
		uid : uid,
		total_amount_received : 0
	};
	var query = connection.query('INSERT INTO receiver_list SET ?', receiver, function(err, result){
		callback(result);
	});
}
