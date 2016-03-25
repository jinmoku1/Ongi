/**
 * Handles routing for all client requests for application
 * 
 * @module router
 * @requires module:controls/main_control
 */

var mainControl	= require('./controls/main_control');

/**
 * This function controls and handles all routing for GET and POST requests for all pages
 * and functionalities
 * 
 * @param {object} app The application framework - express
 */
exports.route = function (app) {
	// account (user)
	app.get('/', mainControl.index);
//	app.post('/-', mainControl.);
};
