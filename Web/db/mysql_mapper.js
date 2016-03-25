

var mysql = require('mysql');

var connection = mysql.createConnection({
	host :'localhost',
	port : 3306,
	user : 'root',
	password : '123',
	database:'web'
});

connection.connect(function(err) {
	if (err) {
		console.error('mysql connection error');
		console.error(err);
		throw err;
	}
});

exports.getUserByUid = function(uid, callback) {
	var query = connection.query('SELECT * FROM users WHERE uid = ?', [uid], function(err, result){
		callback(err, result);
	});
}

exports.insertOrUpdateOnExist = function(user, callback) {
	var query = connection.query("INSERT INTO users (uid, nickName, email, phone, meteringDay, maxLimitUsageBill, userType) VALUES " + 
			"(?, ?, ?, ?, ?, ?, ?) " +
			"ON DUPLICATE KEY UPDATE " + 
			"nickName=?, " +
			"email=?, " +
			"phone=?, " +
			"meteringDay=?, " +
			"maxLimitUsageBill=?, " +
			"userType=?", [user.uid, user.nickName, user.email, user.phone, user.meteringDay, user.maxLimitUsageBill, user.userType, 
			               user.nickName, user.email, user.phone, user.meteringDay, user.maxLimitUsageBill, user.userType], function(err, result){
		callback(err, result);
	});
}

exports.getNextReceiver = function(callback) {
	var query = connection.query('SELECT * FROM receiver_list ORDER BY total_amount_received, last_time_received ASC LIMIT 1', function(err, result){
		callback(err, result);
	});
}

exports.addToReceiverList = function(user, callback) {
	var receiver = {
		uid : user.uid,
		total_amount_received : 0
	};
	var query = connection.query('INSERT INTO receiver_list SET ?', receiver, function(err, result){
		callback(err, result);
	});
}

exports.updateReceiverList = function(uid, delta_amount, callback) {
	var query = connection.query('UPDATE receiver_list SET total_amount_received = total_amount_received + ? WHERE uid = ?', 
								[delta_amount, uid], function(err, result){
		callback(err, result);
	});
}

exports.addToDonorList = function(user, callback) {
	var donor = {
		uid : user.uid,
		total_amount_donated : 0
	};
	var query = connection.query('INSERT INTO donor_list SET ?', donor, function(err, result){
		callback(err, result);
	});
}

exports.updateDonorList = function(uid, delta_amount, callback) {
	var query = connection.query('UPDATE donor_list SET total_amount_donated = total_amount_donated + ? WHERE uid = ?', 
								[delta_amount, uid], function(err, result){
		callback(err, result);
	});
}

exports.makeDonation = function(uidFrom, uidTo, amount, callback) {
	var donation = {
		uidFrom : uidFrom,
		uidTo : uidTo,
		amount : amount
	};
	var query = connection.query('INSERT INTO donation_list SET ?', donation, function(err, result){
		callback(err, result);
	});
}

exports.insertAccessToken = function(userAuthCode, callback) {

	var query = connection.query('INSERT INTO userAuthCode SET ?', userAuthCode, function(err, result){
		callback(result);
	});
}
