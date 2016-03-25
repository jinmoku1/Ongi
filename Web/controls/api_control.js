var mysqlMapper = require('../db/mysql_mapper');
var session = require('../session');
var http = require('http');
var intervalRealtimeUsage;
var request = require('request');
var multer = require('multer');

var upload = multer({ dest: 'uploads/' })

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
		if(result) {
			mysqlMapper.insertUserUsage(1, result, function(insertResult){
				res.json({status:200, responseData : insertResult});
			});
		}
	});
}

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
