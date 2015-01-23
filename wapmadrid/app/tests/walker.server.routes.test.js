'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Walker = mongoose.model('Walker'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, walker;

/**
 * Walker routes tests
 */
describe('Walker CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Walker
		user.save(function() {
			walker = {
				name: 'Walker Name'
			};

			done();
		});
	});

	it('should be able to save Walker instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Walker
				agent.post('/walkers')
					.send(walker)
					.expect(200)
					.end(function(walkerSaveErr, walkerSaveRes) {
						// Handle Walker save error
						if (walkerSaveErr) done(walkerSaveErr);

						// Get a list of Walkers
						agent.get('/walkers')
							.end(function(walkersGetErr, walkersGetRes) {
								// Handle Walker save error
								if (walkersGetErr) done(walkersGetErr);

								// Get Walkers list
								var walkers = walkersGetRes.body;

								// Set assertions
								(walkers[0].user._id).should.equal(userId);
								(walkers[0].name).should.match('Walker Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Walker instance if not logged in', function(done) {
		agent.post('/walkers')
			.send(walker)
			.expect(401)
			.end(function(walkerSaveErr, walkerSaveRes) {
				// Call the assertion callback
				done(walkerSaveErr);
			});
	});

	it('should not be able to save Walker instance if no name is provided', function(done) {
		// Invalidate name field
		walker.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Walker
				agent.post('/walkers')
					.send(walker)
					.expect(400)
					.end(function(walkerSaveErr, walkerSaveRes) {
						// Set message assertion
						(walkerSaveRes.body.message).should.match('Please fill Walker name');
						
						// Handle Walker save error
						done(walkerSaveErr);
					});
			});
	});

	it('should be able to update Walker instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Walker
				agent.post('/walkers')
					.send(walker)
					.expect(200)
					.end(function(walkerSaveErr, walkerSaveRes) {
						// Handle Walker save error
						if (walkerSaveErr) done(walkerSaveErr);

						// Update Walker name
						walker.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Walker
						agent.put('/walkers/' + walkerSaveRes.body._id)
							.send(walker)
							.expect(200)
							.end(function(walkerUpdateErr, walkerUpdateRes) {
								// Handle Walker update error
								if (walkerUpdateErr) done(walkerUpdateErr);

								// Set assertions
								(walkerUpdateRes.body._id).should.equal(walkerSaveRes.body._id);
								(walkerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Walkers if not signed in', function(done) {
		// Create new Walker model instance
		var walkerObj = new Walker(walker);

		// Save the Walker
		walkerObj.save(function() {
			// Request Walkers
			request(app).get('/walkers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Walker if not signed in', function(done) {
		// Create new Walker model instance
		var walkerObj = new Walker(walker);

		// Save the Walker
		walkerObj.save(function() {
			request(app).get('/walkers/' + walkerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', walker.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Walker instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Walker
				agent.post('/walkers')
					.send(walker)
					.expect(200)
					.end(function(walkerSaveErr, walkerSaveRes) {
						// Handle Walker save error
						if (walkerSaveErr) done(walkerSaveErr);

						// Delete existing Walker
						agent.delete('/walkers/' + walkerSaveRes.body._id)
							.send(walker)
							.expect(200)
							.end(function(walkerDeleteErr, walkerDeleteRes) {
								// Handle Walker error error
								if (walkerDeleteErr) done(walkerDeleteErr);

								// Set assertions
								(walkerDeleteRes.body._id).should.equal(walkerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Walker instance if not signed in', function(done) {
		// Set Walker user 
		walker.user = user;

		// Create new Walker model instance
		var walkerObj = new Walker(walker);

		// Save the Walker
		walkerObj.save(function() {
			// Try deleting Walker
			request(app).delete('/walkers/' + walkerObj._id)
			.expect(401)
			.end(function(walkerDeleteErr, walkerDeleteRes) {
				// Set message assertion
				(walkerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Walker error error
				done(walkerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Walker.remove().exec();
		done();
	});
});