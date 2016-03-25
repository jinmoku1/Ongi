var mysqlMapper = require('../db/mysql_mapper');
var session = require('../session');

/*
 * req:
 */
exports.donate = function(req, res) {
	var amount = req.body.amount;

	var user = session.getSessionUser(req);

<<<<<<< HEAD
	mysqlMapper.getNextReceiver(function(result){
		var uid = result.uid;

	});
};


/*
 * req:
 */
function addToReceiverList(uid, callback) {

	var amount = 400;

	var user = session.getSessionUser(req);
=======
>>>>>>> 57b617fe9c561a2bb39c6e14438e93b2c3c454c8
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
