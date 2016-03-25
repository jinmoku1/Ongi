/**
 * Handles routing for all client requests for application
 *
 * @module router
 * @requires module:controls/main_control
 */

var main = require('./controls/main_control');
var api = require('./controls/api_control');
var multiparty = require('multiparty');
var format = require('util').format;
var multer = require('multer');
var fs = require('fs');
var exec = require('child_process').exec;


/**
 * This function controls and handles all routing for GET and POST requests for all pages
 * and functionalities
 *
 * @param {object} app The application framework - express
 */
exports.route = function (app) {
	// account (user)
	var upload = multer({ dest: './public/uploads' });

	app.get('/', main.index);
	app.get('/session', main.session);
	app.get('/loginGeneral', main.loginGeneral);
	app.get('/admin/signup', main.admin);
	app.post('/admin/signup/add',upload.single('file'),main.adminAdd);
	app.get('/startWriteRealtimeUsage', api.startWriteRealtimeUsage);
	app.get('/stopWriteRealtimeUsage', api.stopWriteRealtimeUsage);
	app.get('/test', api.testApi);
	app.get('/donate', api.donate);




};
