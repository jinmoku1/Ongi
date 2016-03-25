/**
 * @module controls/mainControl
 */

var mysqlMapper = require('../db/mysql_mapper');
var session = require('../session');

exports.index = function(req, res) {
	res.send('hello world: ');
};

exports.session = function(req, res) {
	res.send('sesion uid: ' + session.getSessionUser(req).uid);
};

exports.signup = function(req,res){
	res.render('admin/signup');
};


exports.loginGeneral = function(req, res) {
//	var uid = req.body.uid;
//	var nickName = req.body.nickName;
//	var email = req.body.email;
//	var phone = req.body.phone;
//	var meteringDay = req.body.meteringDay;
//	var maxLimitUsageBill = req.body.maxLimitUsageBill;

	var uid = 'abc';
	var nickName = 'ffff';
	var email = '2#';
	var phone = '2020';
	var meteringDay = '11131114';
	var maxLimitUsageBill = '3242';
	var user = {
		uid : uid,
		nickName : nickName,
		email : email,
		phone : phone,
		meteringDay : meteringDay,
		maxLimitUsageBill : maxLimitUsageBill
	}

	mysqlMapper.insertOrUpdateOnExist(user, function(err, result){
		if (err) {
			console.error(err);
		}
		console.log(user);
		session.setSessionUser(req, user);
		res.send('1');
	});
};
