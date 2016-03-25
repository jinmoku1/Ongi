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
	
	console.log(user);
	var accessToken = 'ad9dd193010e1d9e110e4f3a87826504ed59b9ed612be38a311d9d2d73894bcd';
//	var get_options = {
//		host: 'closure-compiler.appspot.com',
//		port: '80',
//		path: '/compile',
//		method: 'POST',
//		headers: {
//			'Content-Type': 'application/x-www-form-urlencoded',
//		}
//	};
	
	
	session.setSessionUser(req, user);
	
	mysqlMapper.insertOrUpdateOnExist(user, function(err, result){
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