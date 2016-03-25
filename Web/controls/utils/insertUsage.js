var mysqlMapper = require('../../db/mysql_mapper');
var request = require('request');
var apn = require('apn');

var COUNT_THRESHOLD = 10;
var POWER_THRESHOLD = 1000;

exports.startWriteRealtimeUsage = function(){
	console.log("usage insert start");
	mysqlMapper.selectAllBasicInfos(function(err, result) {
		for (var i in result) {
			console.log("result: " + JSON.stringify(result[i]));
			setIntervalRealtimeUsage(result[i].userId, result[i].accessToken, result[i].deviceId);
		}
	});
};

var setIntervalRealtimeUsage = function(userId, accessToken, deviceId){
	if(accessToken && deviceId){
		setInterval(function() {
			sendApiByName('realtimeUsage', accessToken, deviceId, function(result){
				console.log("result: " + JSON.stringify(result));
				if(result) {
					checkActivePowerInterval(userId, result, function(count){
						if(count > COUNT_THRESHOLD){
							console.log("push alarm device")
							pushAlarm();
						}
						else{
							mysqlMapper.insertUserHistory(userId, result, count, function(err, result){
								console.log("insertUserHistory");
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

	mysqlMapper.getUserHistory(userId, function(err, result){
		var history = result[0];
		if(history) {
			console.log("history: " + JSON.stringify(history));
			var pastActivePower = history.activePower;
			var pastCount = history.count;

			if (Math.abs(activePower - pastActivePower) < POWER_THRESHOLD) {
				f(pastCount + 1);
			}
			else {
				f(pastCount);
			}
		}
		else{
			f(0);
		}
	});
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

var pushAlarm = function(){

	var options = {
		gateway : "gateway.sandbox.push.apple.com",
		cert: './keys/cert.pem',
		key: './keys/key.pem'
	};

	var apnConnection = new apn.Connection(options);

	var token = '앞에서 Xcode로 build 하면서 획득한 아이폰 디바이스 토큰을 입력한다.'
	var myDevice = new apn.Device(token);

	var note = new apn.Notification();
	note.badge = 3;
	note.alert = '전력량 변화가 없습니다';
	note.payload = {'message': '안녕하세요'};

	apnConnection.pushNotification(note, myDevice);
}