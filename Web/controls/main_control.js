/**
 * @module controls/mainControl
 */
var querystring = require('querystring');
var http = require('http');
var utf8 = require('utf8');

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
	res.send('sesion uid: ' + session.getSessionUser(req));
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
	var accessToken = '1c8e6ca7bc846307e7a93ddb12ec71cfc970b0fd107acd71f80028d4cf8ef2081541735193d3fabefcb4039a8aa14f3a99e1abf7c7d13ef516062ed91bf49d3a';
	
	
	var user = {
		uid : uid,
		nickName : nickName,
		email : email,
		phone : phone,
		meteringDay : meteringDay,
		maxLimitUsageBill : maxLimitUsageBill,
		userType : userType
	}

//	var get_options = {
//		host: 'closure-compiler.appspot.com',
//		port: '80',
//		path: '/compile',
//		method: 'POST',
//		headers: {
//			'Content-Type': 'application/x-www-form-urlencoded',
//			'Content-Length': Buffer.byteLength(post_data)
//		}
//	};

	mysqlMapper.getUserByUid(user.uid, function(err, result){
		var exists = result;
		mysqlMapper.insertOrUpdateOnExist(user, function(err, result){
			session.setSessionUser(req, user);
			if (err) {
				console.error(err);
				res.send('0');
			}
			else {
				console.log(exists);
				if (exists == undefined || exists.length == 0){
					mysqlMapper.addToDonorList(user, function(err, result){ 
						if (err) {
							console.error(err);
							res.send('0');
						}
						else {
							if (user.userType == 'O'){
								mysqlMapper.addToReceiverList(user, function(err, result){
									if (err) {
										console.error(err);
										res.send('0');
									}
									else {
										res.send('1');
									}
								});
							}
							else {
								res.send('1');
							}
						}
					});
				}
				else {
					res.send('1');
				}
			}
		});
	});
};

exports.admin = function(req,res){
	res.render('admin/signup');
};

exports.adminAdd = function(req,res){
	var identification = req.query.lg_name;
	var authCode = req.query.code;
	nickName=identification.slice(0, identification.indexOf("?"));
	nickName=utf8.decode(nickName);
	console.log(nickName);
	console.log(authCode);
	var userAuthCode = {
		authCode:authCode,
		accessToken:"test",
		nickName:nickName,
		identification:identification
	}

	mysqlMapper.insertAccessToken(userAuthCode, function(err, result){
		if (err) {
			console.error(err);
		}
		console.log(userAuthCode);
		session.setSessionUser(req, userAuthCode);
		res.send('1');
	});

};
