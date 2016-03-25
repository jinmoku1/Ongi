var mysqlMapper = require('../../db/mysql_mapper');

exports.startWriteRealtimeUsage = function(){

	console.log("usage insert start");

	//mysqlMapper.makeDonation(uidFrom, uidTo, amount, function(err, result) {
	//	for (var i in result) {
	//		setIntervalRealtimeUsage(result[i].accessToken, result[i].deviceId);
	//	}
	//});
};

var setIntervalRealtimeUsage = function(accessToken,deviceId){
	if(accessToken && deviceId){
		setInterval(function() {
			sendApiByName('realtimeUsage', accessToken, deviceId, function(result){
				console.log("result: " + JSON.stringify(result));

				if(result) {
					mysqlMapper.insertUserUsage(1, result, function(insertResult){
						console.log("insertRows: " + JSON.stringify(insertResult));
					});
				}
			});
		}, 3000);
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