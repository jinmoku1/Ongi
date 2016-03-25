var mysqlMapper = require('../db/mysql_mapper');
var session = require('../session');
var http = require('http');
var intervalRealtimeUsage;
var DEVICE_ID;

/*
 * req:
 */
exports.donate = function(req, res) {
	var amount = req.body.amount;

	var user = session.getSessionUser(req);

	var uidFrom = user.uid;

	mysqlMapper.getNextReceiver(function(err, result){
		if (err){
			console.error(err);
		}
		else {
			var uidTo = result[0].uid;
			mysqlMapper.makeDonation(uidFrom, uidTo, amount, function(err, result){
				if (err){
					console.error(err);
				}
				else {
					mysqlMapper.updateReceiverList(uidTo, amount, function(err, result){
						if (err){
							console.error(err);
						}
						else {
							mysqlMapper.updateDonorList(uidFrom, amount, function(err, result){
								if (err){
									console.error(err);
								}
								else {
									mysqlMapper.getUserByUid(uidTo, function(err, result){
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

exports.startWriteRealtimeUsage = function(req, res){
	if(session.getSessionUser()){

		intervalRealtimeUsage = setInterval(function(str1, str2) {
			console.log(str1 + " " + str2);
		}, 2000, "Hello.", "How are you?");

		res.json({status:200, responseData : "not login user"});
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

exports.testApi = function(req, res){
	sendApiByName('realtimeUsage', function(result){
		res.json({status:200, responseData : result});
	});
}

var getAccessToken = function(){
	var accessToken = null, sessionUser = session.getSessionUser();
	if(sessionUser){
		accessToken = sessionUser.accessToken;
	}
	return accessToken;
}

var retrieveDeviceId = function(accessToken, f){
	if(accessToken) {
		var options = {
			method: 'GET',
			url: 'https://enertalk-auth.encoredtech.com/uuid',
			headers: {
				'Authorization': "Bearer " + accessToken
			}
		};

		function callback(error, response, body) {
			if (!error && response.statusCode == 200) {
				var deviceId;
				var result = JSON.parse(body);
				console.log(result);
				deviceId = result.uuid;
				if (deviceId) {
					f(deviceId);
				}
			}
		}
		request(options, callback);
	}
	else{
		f(null)
	}
}

var sendApiRequest = function(apiName, accessToken, deviceId, f){
	if(accessToken && deviceId){
		var apiUrl = "https://api.encoredtech.com:8082/1.2/devices/" + deviceId;
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
		}
		request(options, callback);
	}
	else{
		f(null);
	}
}

var sendApiByName = function(apiName, f){
	var accessToken = getAccessToken();
	var deviceId = DEVICE_ID;

	if(accessToken){
		if(deviceId){
			sendApiRequest(apiName, accessToken, deviceId, function(result){
				console.log(result);
				f(result);
			});
		}
		else{
			retrieveDeviceId(accessToken, function(deviceId){
				sendApiRequest(apiName, accessToken, deviceId, function(result){
					console.log(result);
					f(result);
				});
			});
		}
	}
	else{
		// not login
		f(null);
	}
}
