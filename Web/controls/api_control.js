
var mysqlMapper = require('../db/mysql_mapper');
var session = require('../session');

/*
 * req:
 */
exports.donate = function(req, res) {
	var uid = req.body.uid;
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
		if (err){
			console.error(err);
			throw err;
		}
		else {
			callback();
		}
	})
};
