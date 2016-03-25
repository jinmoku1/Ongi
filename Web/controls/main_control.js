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
	api.appPush({userId: '1'},function(){
		res.send("success");
	})
};

exports.session = function(req, res) {
	res.send('sesion uid: ' + session.getSessionUser(req));
};

exports.signup = function(req,res){
	res.render('admin/signup');
};


exports.loginGeneral = function(req, res) {
	var accessToken = req.body.accessToken;
	accessToken = '7c1cd40ae008fe2e6b85f3eb5c6538fa0bd7b7349cfdcf2f2b02e95beafa2829aed40834e1aa3aac7735d58924af8b369fab7c9fe119da0ae7f0b4799853b1aa';

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
	var name = req.query.nickName;
	var phone = req.query.phoneNumber;
	var email = req.query.email;
	var accessToken = req.query.access_token;
	var address = req.query.address;
	var file = __dirname + "/" + req.file.name;
	var imageUrl = req.file.path;
	

	api.retrieveUser(accessToken, function(userHelpee){
		if (userHelpee == null){
			res.send('0');
		}
		else {
			userHelpee.userType = 'O';
			if (userHelpee.nickName == null){
				userHelpee.nickName = name;
			}
			userHelpee.address = address;
			userHelpee.imageUrl = imageUrl;
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
										// image file
										fs.readFile( req.file.path, function (err, data) {
												fs.writeFile(file, data, function (err) {
													res.send('1');
											});
										});
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
