

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

exports.getUserByUserId = function(userId, callback) {
	var query = connection.query('SELECT * FROM users WHERE userId = ?', [userId], function(err, result){
		callback(err, result);
	});
}

exports.getUserByPhoneOrEmail = function(phone, email, callback) {
	var query = connection.query('SELECT * FROM users WHERE phone = ? OR email = ?', [phone, email], function(err, result){
		callback(err, result);
	});
}

exports.insertOrUpdateOnExist = function(user, callback) {
	var query = connection.query("INSERT INTO users (userId, nickName, email, phone, meteringDay, maxLimitUsageBill, userType) VALUES " + 
			"(?, ?, ?, ?, ?, ?, ?) " +
			"ON DUPLICATE KEY UPDATE " + 
			"nickName=?, " +
			"email=?, " +
			"phone=?, " +
			"meteringDay=?, " +
			"maxLimitUsageBill=?, " +
			"userType=?", [user.userId, user.nickName, user.email, user.phone, user.meteringDay, user.maxLimitUsageBill, user.userType, 
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
		userId : user.userId,
		total_amount_received : 0
	};
	var query = connection.query('INSERT INTO receiver_list SET ?', receiver, function(err, result){
		callback(err, result);
	});
}

exports.updateReceiverList = function(userId, delta_amount, callback) {
	var query = connection.query('UPDATE receiver_list SET total_amount_received = total_amount_received + ? WHERE userId = ?', 
								[delta_amount, userId], function(err, result){
		callback(err, result);
	});
}

exports.addToDonorList = function(user, callback) {
	var donor = {
		userId : user.userId,
		total_amount_donated : 0
	};
	var query = connection.query('INSERT INTO donor_list SET ?', donor, function(err, result){
		callback(err, result);
	});
}

exports.updateDonorList = function(userId, delta_amount, callback) {
	var query = connection.query('UPDATE donor_list SET total_amount_donated = total_amount_donated + ? WHERE userId = ?', 
								[delta_amount, userId], function(err, result){
		callback(err, result);
	});
}

exports.makeDonation = function(userIdFrom, userIdTo, amount, callback) {
	var donation = {
		userIdFrom : userIdFrom,
		userIdTo : userIdTo,
		amount : amount
	};
	var query = connection.query('INSERT INTO donation_list SET ?', donation, function(err, result){
		callback(err, result);
	});
}

exports.insertOrUpdateBasicInfo = function(tokens, callback) {
	var query = connection.query("INSERT INTO user_basic_info (userId, accessToken, deviceId) VALUES " + 
			"(?, ?, ?) " +
			"ON DUPLICATE KEY UPDATE " + 
			"accessToken=?, " +
			"deviceId=?", [tokens.userId, tokens.accessToken, tokens.deviceId,  
			               tokens.accessToken, tokens.deviceId], function(err, result){
		callback(err, result);
	});
}

exports.selectAllBasicInfos = function(callback) {
	var query = connection.query('SELECT * FROM user_basic_info', function(err, result){
		callback(err, result);
	});
}

exports.insertRelation = function(helperId, helpeeId, callback) {
	var relation = {
		helperId : helperId,
		helpeeId : helpeeId
	}
	var query = connection.query('INSERT INTO relations SET ?', relation, function(err, result){
		callback(err, result);
	});
}

exports.getAllHelpees = function(callback) {
	var query = connection.query('SELECT * FROM users JOIN receiver_list ON users.userId = receiver_list.userId', function(err, result){
		callback(err, result);
	});
}

exports.getMyHelpees = function(userId, callback) {
	var query = connection.query('SELECT * FROM relations JOIN users ON relations.helpeeId = users.userid WHERE helperId = ?', 
			userId, function(err, result){
		callback(err, result);
	});
}

exports.getMyDonationTotal = function(userId, callback) {
	var query = connection.query('SELECT * FROM donor_list WHERE userId = ?', 
			userId, function(err, result){
		callback(err, result);
	});
}

exports.getMyDonations = function(userId, callback) {
	var query = connection.query('SELECT * FROM relations JOIN donation_list ON relations.helperId = donation_list.userIdFrom WHERE helperId = ?', 
			userId, function(err, result){
		callback(err, result);
	});
}

exports.insertUserUsage = function(uid, usage, callback) {

	var usageObj = {
		uid: uid,
		voltage: usage.voltage,
		current: usage.current,
		activePower: usage.activePower,
		apparentPower: usage.apparentPower,
		reactivePower: usage.reactivePower,
		powerFactor: usage.powerFactor,
		wattHour: usage.wattHour,
		powerBase: usage.powerBase
	};

	var query = connection.query('INSERT INTO userUsage SET ?', usageObj, function(err, result){
		callback(result);
	});
}

exports.insertUserHistory = function(userId, usage, count, callback) {
	var query = connection.query("INSERT INTO user_history (userId, activePower, count) VALUES " +
		"(?, ?, ?) " +
		"ON DUPLICATE KEY UPDATE " +
		"activePower = ?, " +
		"count = ?", [userId, usage.activePower, count, usage.activePower, count], function(err, result){
		callback(err, result);
	});
}

exports.getUserHistory = function(userId, callback) {
	var query = connection.query('SELECT * FROM user_history WHERE userId = ?',
		userId, function(err, result){
			callback(err, result);
		});
}

exports.initCountUserHistory = function(userId, callback) {
	var query = connection.query('UPDATE user_history SET count = 0 WHERE userId = ?',
		userId, function(err, result){
			callback(err, result);
		});
}