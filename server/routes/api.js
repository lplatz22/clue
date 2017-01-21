

var configDB = require('../config/database');

// Load the Cloudant library.
var Cloudant = require('cloudant');
var bcrypt   = require('bcrypt-nodejs');

// Initialize Cloudant with settings from .env
var username = configDB.db_creds.username;
var password = configDB.db_creds.password;
var cloudant = Cloudant({account:username, password:password});

var tasksDB = cloudant.db.use(configDB.db_creds.tasksDBName);
var usersDB = cloudant.db.use(configDB.db_creds.usersDBName);

module.exports = function(app, passport) {


	// PROFILE SECTION =========================
	app.post('/api/login', passport.authenticate('local-login', {}), function(req, res) {
    	//req.user
        //return user info
        console.log(req.body.user);
        res.status(200).send(req.body.user);
    });
    // app.post('/api/login', passport.authenticate('local-login', {
    //     successRedirect : '/tasks', // redirect to the secure profile section
    //     failureRedirect : '/login', // redirect back to the signup page if there is an error
    //     failureFlash : true // allow flash messages
    // }));

    app.post('/api/register', function(req, res) {
    	var errorJson = {};

    	if(!req.body){
    		errorJson.error = "No post body found - provide a user";
    	} else if (!req.body.user) {
    		errorJson.error = "No User found";
    	} else if (!req.body.user.email) {
    		errorJson.error = "No User Email found";
    	} else if (!req.body.user.password) {
    		errorJson.error = "No User Password found";
    	} else if (!req.body.user.passwordConfirm) {
    		errorJson.error = "No User Password Confirmation found";
    	} else if (!req.body.user.company) {
    		errorJson.error = "No User Company found";
    	}

    	if(errorJson.error){
    		res.status(400).send(errorJson.error);
    	} else {
    		var user = req.body.user;
    		user.email = user.email.toLowerCase();

    		emailAvaliable(user.email, function (avaliable) {
    			if(!avaliable) {
    				console.log('email unavaliable');
    				res.status(400).send("Email Unavaliable");
    			} else {
    				if(user.password != user.passwordConfirm){
		    			console.log('passwords dont match');
		    			res.status(400).send("Passwords Don't Match");
		    		} else { //passwords match
		    			var hashed_pass = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);

		    			var protectedUser = {
		    				email: user.email,
		    				password: hashed_pass,
		    				company: user.company
		    			}

		    			usersDB.insert(protectedUser, function (er, body, headers) {
						  if (er) {
						    console.log('Failed to insert into users database: ' + er.message);
						    res.status(500).send("Failed to Register: " + protectedUser.email);
						  } else {
						  	res.status(200).send("Successfully Registered: " + protectedUser.email);
						  }
						});
		    		}
    			}
    		});    		
    	}
    });

    //

    app.get('/api/authenticated', isLoggedIn, function(req, res) {
    	// console.log(req.user);
    	console.log('/api/authenticated passed!');
        res.status(200).json({"authenticated": true});
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

function emailAvaliable(email, next) {
	usersDB.find({selector: {email: email}}, function(err, result) {
        if (err){
            next(false);
        } else if (result.docs.length == 0){
            next(true); // avaliable!
        } else {
        	next(false); // not avaliable
        }
    });
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    console.log('isLoggedIn() stopped you!!');

    res.status(401).send('unauthenticated');
}