/**
 * @module controls/mainControl
 */
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

var mysqlMapper = require('../db/mysql_mapper');
var api = require('./api_control');
var session = require('../session');

exports.index = function(req, res) {
	res.send('hello world: ');
};
exports.test = function(req, res) {
	api.appPush(function(){
		res.send("dd");
	})
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
	var accessToken = '';

	api.retrieveUser(accessToken, function(user){
		console.log(user);
		user.userType = 'N';
		addUser(req, user, function(exists){
			res.send('1');
		});
	});
};

exports.admin = function(req,res){
	res.render('admin/signup');
};

exports.adminAdd = function(req, res){
//	var accessToken = req.query.access_token;
//	var helperEmail = req.query.helper_email;
//	var helperPhone = req.query.helper_phone;
	console.log(req.file.path);
	console.log(req.file.type);
	var nickName = req.query.nickName;
	var name = nickName;
	var phoneNumber = req.query.phoneNumber;
	var email = req.query.email;
	var accessToken = req.query.access_token;
	var authCode = req.query.auth_code;
	var file = __dirname + "/" + req.file.name;
	var pictureUrl = req.file.path;

	fs.readFile( req.file.path, function (err, data) {
			 fs.writeFile(file, data, function (err) {

					console.log(nickName);
					console.log(phoneNumber);
					console.log(email);
					console.log(accessToken);
					console.log(authCode);
					console.log(pictureUrl);


			});
	});

	api.retrieveUser(accessToken, function(userHelpee){
		if (userHelpee == null){
			res.send('0');
		}
		else {
			userHelpee.userType = 'O';
			if (userHelpee.nickName == null){
				userHelpee.nickName = name;
			}
			addUser(req, userHelpee, function(exists){
				if (! exists){
					mysqlMapper.getUserByPhoneOrEmail(phone, email, function(err, result){
						if (err) {
							console.error(err);
							res.send('0');
						}
						else {
							var helperId = result[0].userId;
							mysqlMapper.insertRelation(helperId, userHelpee.userId, function(err, result){
								if (err) {
									console.error(err);
									res.send('0');
								}
								else {
									insertBasicInfo(userHelpee.userId, accessToken, function(){
										res.send('1');
									});
								}
							});
						}
					});
				}
				else {
					insertBasicInfo(userHelpee.userId, accessToken, function(){
						res.send('1');
					});
				}
			});
		}
	});
};

var addUser = function(req, user, callback){
	mysqlMapper.getUserByUserId(user.userId, function(err, result){
		var exists = true;
		if (result == undefined || result.length == 0){
			exists = false;
		}
		mysqlMapper.insertOrUpdateOnExist(user, function(err, result){
			session.setSessionUser(req, user);
			if (err) {
				console.error(err);
				callback(exists);
			}
			else {
				if (! exists){
					mysqlMapper.addToDonorList(user, function(err, result){
						if (err) {
							console.error(err);
							callback(exists);
						}
						else {
							if (user.userType == 'O'){
								mysqlMapper.addToReceiverList(user, function(err, result){
									if (err) {
										console.error(err);
										callback(exists);
									}
									else {
										callback(exists);
									}
								});
							}
							else {
								callback(exists);
							}
						}
					});
				}
				else {
					callback(exists);
				}
			}
		});
	});
}

var insertBasicInfo = function(userId, accessToken, callback){
	api.retrieveDeviceId(accessToken, function(deviceId){
		var userAuthCode = {
				accessToken: accessToken,
				deviceId: deviceId,
				userId: userId
		}

		mysqlMapper.insertOrUpdateBasicInfo(userAuthCode, function(err, result){
			if (err) {
				console.error(err);
			}
			else {
				callback();
			}
		});
	});
}
