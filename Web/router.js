/**
 * Handles routing for all client requests for application
 *
 * @module router
 * @requires module:controls/main_control
 */

var main = require('./controls/main_control');
var api = require('./controls/api_control');

/**
 * This function controls and handles all routing for GET and POST requests for all pages
 * and functionalities
 *
 * @param {object} app The application framework - express
 */
exports.route = function (app) {
	// account (user)
	app.get('/', main.index);
	app.get('/session', main.session);
	app.get('/loginGeneral', main.loginGeneral);
	app.get('/admin/signup', main.admin);
	//app.get('/admin/signup',mainControl.signup);
	app.get('/admin/signup/add',main.adminAdd);
	app.get('/donate', api.donate);
};
