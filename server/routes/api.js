

var configDB = require('../config/database');

// Load the Cloudant library.
var Cloudant = require('cloudant');

// Initialize Cloudant with settings from .env
var username = configDB.db_creds.username;
var password = configDB.db_creds.password;
var cloudant = Cloudant({account:username, password:password});

var tasksDB = cloudant.db.use(configDB.db_creds.tasksDBName);

module.exports = function(app, passport) {


	// PROFILE SECTION =========================
	app.post('/api/login', function(req, res) {
    	//req.user
        //return user info
        console.log(req.body.user);
        res.status(401).send(req.body.user);
    });

    app.get('/api/profile', isLoggedIn, function(req, res) {
    	//req.user
        //return user info
        res.status(200).send(req.user);
    });

    // LOGOUT ==============================
    app.get('/api/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


	//========== API Routes Below =============

	app.get('/api/tasks', (req, res) => {
		var getAllQuery = {
			selector: {
				"_id": {
					"$gt": 0
				}
			}
		}
		tasksDB.find(getAllQuery, function(err, data) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.status(200).send(data.docs);
			}
		});
	});

	app.get('/api/task', isLoggedIn, (req, res) => {

		var id = req.query.task_id;

		tasksDB.get(id, function(err, data) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.status(200).send(data);
			}
		});
	});
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.status(401).send('unauthenticated');
}