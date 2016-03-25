var mysqlMapper = require('../db/mysql_mapper');
var session = require('../session');
var http = require('http');
var intervalRealtimeUsage;
var request = require('request');

/*
 * req:
 */
exports.donate = function(req, res) {
	var amount = req.body.amount;

	var user = session.getSessionUser(req);

	var userIdFrom = user.userId;

	mysqlMapper.getNextReceiver(function(err, result){
		if (err){
			console.error(err);
		}
		else {
			var userIdTo = result[0].userId;
			mysqlMapper.makeDonation(userIdFrom, userIdTo, amount, function(err, result){
				if (err){
					console.error(err);
				}
				else {
					mysqlMapper.updateReceiverList(userIdTo, amount, function(err, result){
						if (err){
							console.error(err);
						}
						else {
							mysqlMapper.updateDonorList(userIdFrom, amount, function(err, result){
								if (err){
									console.error(err);
								}
								else {
									mysqlMapper.getUserByUserId(userIdTo, function(err, result){
										if (err){
											console.error(err);
										}
										else {
											console.log(result[0]);
											res.json(result);
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

exports.testApi = function(req, res){
	var accessToken = getAccessToken(req);
	var deviceId = getDeviceId(req);

    accessToken = '1c8e6ca7bc846307e7a93ddb12ec71cfc970b0fd107acd71f80028d4cf8ef2081541735193d3fabefcb4039a8aa14f3a99e1abf7c7d13ef516062ed91bf49d3a';
	deviceId = '6A92ED86-E66B-11E5-9730-9A79F3FFF7B8';

	sendApiByName('realtimeUsage', accessToken, deviceId, function(result){
		res.json({status:200, responseData : result});
	});
}

exports.startWriteRealtimeUsage = function(req, res){
	var accessToken = getAccessToken(req);
	var deviceId = getDeviceId(req);

	if(accessToken){
		intervalRealtimeUsage = setInterval(function() {
			sendApiByName('realtimeUsage', accessToken, deviceId, function(result){
				res.json({status:200, responseData : result});
			});
		}, 2000);
	}
	else{
		res.json({status:200, responseData : "startWriteRealtimeUsage"});
	}
};

exports.stopWriteRealtimeUsage = function(req, res){
	if(intervalRealtimeUsage){
		clearInterval(intervalRealtimeUsage);
		intervalRealtimeUsage = null;
	}
	res.json({status:200, responseData : "stopWriteRealtimeUsage"});
};

exports.retrieveDeviceId = function(accessToken, f){
	if(accessToken) {
		var options = {
			method: 'GET',
			url: 'https://enertalk-auth.encoredtech.com/uuid',
			headers: {
				'Authorization': "Bearer " + accessToken
			}
		};

		request(options, function(error, response, body){
			if (!error && response.statusCode == 200) {
				var deviceId;
				var result = JSON.parse(body);
				deviceId = result.uuid;
				f(deviceId);
			}
			else{
				f(error);
			}
		});
	}
	else{
		f(null)
	}
}

exports.retrieveUser = function(accessToken, f){
	if (accessToken) {
		console.log("fajsdiofdsjf");
		var options = {
			method: 'GET',
			url: 'https://api.encoredtech.com/1.2/me',
			headers: {
				'Authorization': "Bearer " + accessToken
			}
		};

		request(options, function(error, response, body){
			if (!error && response.statusCode == 200) {
				var user = JSON.parse(body);
				f(user);
			}
			else{
				f(error);
			}
		});
	}
	else{
		f(null)
	}
}

var getAccessToken = function(req){
	var accessToken = null, sessionUser = session.getSessionUser(req);
	if(sessionUser){
		accessToken = sessionUser.accessToken;
	}
	return accessToken;
}

var getDeviceId = function(req){
	var deviceId = null, sessionUser = session.getSessionUser(req);
	if(sessionUser){
		deviceId = sessionUser.deviceId;
	}
	return deviceId;
}

var setDeviceIdInSession = function(req, deviceId){
	console.log("setDeviceIdInSession");
	var sessionUser = session.getSessionUser(req);
	if(sessionUser){
		sessionUser.deviceId = deviceId;
	}
	console.log("sessionUser: " + JSON.stringify(sessionUser));
}



var sendApiRequest = function(apiName, accessToken, deviceId, f){
	if(accessToken && deviceId){
		var apiUrl = "https://api.encoredtech.com:8082/1.2/devices/" + deviceId;
		if (apiName !== 'deviceInfo'){
			apiUrl += '/' + apiName;
		}
		console.log("requestUrl: " + apiUrl);

		var options = {
			method: 'GET',
			url: apiUrl,
			headers: {
				'Authorization': "Bearer " + accessToken
			}
		};

		function callback(error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				f(result);
			}
			else{
				console.log(response.statusCode);
				f(response)
			}
		}
		request(options, callback);
	}
	else{
		f(null);
	}
}

var sendApiByName = function(apiName, accessToken, deviceId, f){
	if(accessToken && deviceId){
		sendApiRequest(apiName, accessToken, deviceId, function(result){
			f(result);
		});
	}
	else{
		// not login
		f(null);
	}
}