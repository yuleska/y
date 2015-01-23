'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var walkers = require('../../app/controllers/walkers.server.controller');

	// Walkers Routes
	app.route('/walkers')
		.get(walkers.list)
		.post(users.requiresLogin, walkers.create);

	app.route('/walkers/:walkerId')
		.get(walkers.read)
		.put(users.requiresLogin, walkers.hasAuthorization, walkers.update)
		.delete(users.requiresLogin, walkers.hasAuthorization, walkers.delete);

	// Finish by binding the Walker middleware
	app.param('walkerId', walkers.walkerByID);
};
