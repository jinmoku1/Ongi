var mysqlMapper = require('../../db/mysql_mapper');
var api = require('../api_control');
var request = require('request');
var apn = require('apn');

var COUNT_THRESHOLD = 10;
var POWER_THRESHOLD = 1000;
var INVALID = -1;

exports.startWriteRealtimeUsage = function(){
	console.log("usage insert start");
	mysqlMapper.selectAllBasicInfos(function(err, result) {
		for (var i in result) {
			setIntervalRealtimeUsage(result[i].userId, result[i].accessToken, result[i].deviceId);
		}
	});
};

var setIntervalRealtimeUsage = function(userId, accessToken, deviceId){
	if(accessToken && deviceId){
		setInterval(function() {
			sendApiByName('realtimeUsage', accessToken, deviceId, function(result){
				if(result) {
					checkActivePowerInterval(userId, result, function(count){
						if(count > COUNT_THRESHOLD){
							api.appPush({
								userId : userId,
								msg : '온기가 필요해.'
							}, function(){
							})

							mysqlMapper.initCountUserHistory(userId, function(err, result){
							});
						}
						else{
							mysqlMapper.insertUserHistory(userId, result, count, function(err, result){
							});
						}
					});
				}
			});
		}, 3000);
	}
}

var checkActivePowerInterval = function(userId, usage, f){
	var activePower = usage.activePower;
	if(activePower) {
		mysqlMapper.getUserHistory(userId, function (err, result) {
			var history = result[0];
			if (history) {
//				console.log("history: " + JSON.stringify(history));
				var pastActivePower = history.activePower;
				var pastCount = history.count;

				if (Math.abs(activePower - pastActivePower) < POWER_THRESHOLD) {
					f(pastCount + 1);
				}
				else {
					f(pastCount);
				}
			}
			else {
				f(INVALID);
			}
		});
	}
	else{
		f(INVALID);
	}
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
//				console.log(response.statusCode);
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

exports.sendApiByName = sendApiByName;