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
	app.get('/admin/signup/add',main.adminAdd);
	app.get('/startWriteRealtimeUsage', api.startWriteRealtimeUsage);
	app.get('/stopWriteRealtimeUsage', api.stopWriteRealtimeUsage);
	app.get('/test', api.testApi);
	app.get('/donate', api.donate);

	app.get('/upload', function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Image: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
	});

	app.post('/upload', function(req, res, next){
	  // create a form to begin parsing
	  var form = new multiparty.Form();
	  var image;
	  var title;

	  form.on('error', next);
	  form.on('close', function(){
	    res.send(format('\nuploaded %s (%d Kb) as %s'
	      , image.filename
	      , image.size / 1024 | 0
	      , title));
	  });

	  // listen on field event for title
	  form.on('field', function(name, val){
	    if (name !== 'title') return;
	    title = val;
	  });

	  // listen on part event for image file
	  form.on('part', function(part){
	    if (!part.filename) return;
	    if (part.name !== 'image') return part.resume();
	    image = {};
	    image.filename = part.filename;
	    image.size = 0;
	    part.on('data', function(buf){
	      image.size += buf.length;
	    });
	  });


	  // parse the form
	  form.parse(req);
	});



};
