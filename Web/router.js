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

/**
 * This function controls and handles all routing for GET and POST requests for all pages
 * and functionalities
 *
 * @param {object} app The application framework - express
 */
exports.route = function (app) {

	var upload = multer({ dest: './public/uploads' });

	// account (user)
	app.get('/', main.index);
	app.get('/session', main.session);
	app.post('/loginGeneral', main.loginGeneral);
	app.get('/admin/signup', main.admin);
	app.post('/admin/signup/add',upload.single('file'),main.adminAdd);
	app.get('/test', main.test);
	app.post('/donate', api.donate);


};
