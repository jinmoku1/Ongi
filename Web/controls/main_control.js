/**
 * @module controls/mainControl
 */
var querystring = require('querystring');
var http = require('http');

var mysqlMapper = require('../db/mysql_mapper');
var session = require('../session');

exports.index = function(req, res) {
	res.send('hello world: ');
};
exports.test = function(req, res) {
	mysqlMapper.getNextReceiver(function(err, result){
		if (err){
			console.error(err);
		}
		else {
			var uidTo = result[0].uid;
			res.send('test: '+uidTo);
		}
	});
};

exports.session = function(req, res) {
	res.send('sesion uid: ' + session.getSessionUser(req).uid);
};

exports.signup = function(req,res){
	res.render('admin/signup');
};


exports.loginGeneral = function(req, res) {
//	var uid = req.body.uid;
//	var nickName = req.body.nickName;
//	var email = req.body.email;
//	var phone = req.body.phone;
//	var meteringDay = req.body.meteringDay;
//	var maxLimitUsageBill = req.body.maxLimitUsageBill;
	var uid = 'def';
	var nickName = 'ffff';
	var email = '2#';
	var phone = '2020';
	var meteringDay = '11131114';
	var maxLimitUsageBill = '3242';
	var userType = 'N';
	
	var user = {
		uid : uid,
		nickName : nickName,
		email : email,
		phone : phone,
		meteringDay : meteringDay,
		maxLimitUsageBill : maxLimitUsageBill,
		userType : userType
	}

	var get_options = {
		host: 'closure-compiler.appspot.com',
		port: '80',
		path: '/compile',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(post_data)
		}
	};

	mysqlMapper.insertOrUpdateOnExist(user, function(err, result){
		if (err) {
			console.error(err);
		}
		else {
			console.log(user);
			session.setSessionUser(req, user);
			res.send('1');
		}
	});
};

exports.admin = function(req,res){
	res.render('admin/signup');
};

exports.adminAdd = function(req,res){
	var userAuthCode = {
		authCode:"test",
		accessToken:"test",
		nickName:"할매"
	}
	mysqlMapper.insertOrUpdateOnExist(userAuthCode, function(err, result){
>>>>>>> c43477dbb8dbae0f262f22a74dc1a5d2037915ff
		if (err) {
			console.error(err);
		}
		if (user.userType == 'O'){
			mysqlMapper.addToReceiverList(user, function(err, result){
				res.send('1:O');
			})
		}
		else if (user.userType == 'N') {
			mysqlMapper.addToDonorList(user, function(err, result){
				res.send('1:N');
			})
		}
		else {
			res.send('0')
		}
	});
};
