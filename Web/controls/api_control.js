
var mysqlMapper = require('../db/mysql_mapper');
var session = require('../session');

/*
 * req:
 */
exports.donate = function(req, res) {
	var amount = req.body.ammount;

	var user = session.getSessionUser(req);

	mysqlMapper.getNextReceiver(function(result){
		var uid = result.uid;

	});
};


/*
 * req:
 */
function addToReceiverList(uid, callback) {
	mysqlMapper.addToReceiverList(uid, function(err, result){

	var amount = 400;

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
									res.send("1");
								}
							});
						}
					});
				}
			});
		}
	});
};
