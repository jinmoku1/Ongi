/**
 * @module controls/mainControl
 */
var querystring = require('querystring');
var http = require('http');
var utf8 = require('utf8');

var mysqlMapper = require('../db/mysql_mapper');
var api = require('./api_control');
var session = require('../session');

exports.index = function(req, res) {
	res.send('hello world: ');
};
exports.test = function(req, res) {
	
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
	var name = req.query.nickName;
	var phoneNumber = req.query.phoneNumber;
	var email = req.query.email;
	var imageUrl = req.query.imageUrl;
	var accessToken = req.query.access_token;
	
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
