

var configDB = require('../config/database');

// Load the Cloudant library.
var Cloudant = require('cloudant');
var bcrypt   = require('bcrypt-nodejs');

// Initialize Cloudant with settings from .env
var username = configDB.db_creds.username;
var password = configDB.db_creds.password;
var cloudant = Cloudant({account:username, password:password});

var usersDB = cloudant.db.use(configDB.db_creds.usersDBName);

const fs = require('fs');

var gameConfigPath = 'server/config/game.json';
var imagesPath = 'dist/assets/clue_images';


module.exports = function(app, passport) {


	// PROFILE SECTION =========================
	app.post('/api/login', passport.authenticate('local-login', {}), function(req, res) {
        var isAd = req.user.admin;
        var isPriv = req.user.privileged;
        if(!isAd) {
            isAd = false;
        }
        if(!isPriv) {
            isPriv = false;
        }
        var response = {
            loggedIn: true,
            admin: isAd,
            privileged: isPriv
        }
        res.status(200).send(response);
    });

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
    	} else if (!req.body.user.firstName) {
            errorJson.error = "No User Company found";
        } else if (!req.body.user.lastName) {
            errorJson.error = "No User Company found";
        }

    	if(errorJson.error){
    		res.status(400).send(errorJson.error);
    	} else {
    		var user = req.body.user;
    		user.email = user.email.toLowerCase();

    		emailAvaliable(user.email, function (avaliable) {
    			if(!avaliable) {
    				res.status(400).send("Email Unavaliable");
    			} else {
    				if(user.password != user.passwordConfirm){
		    			res.status(400).send("Passwords Don't Match");
		    		} else { //passwords match
		    			var hashed_pass = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);

		    			var protectedUser = {
		    				email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
		    				password: hashed_pass,
		    				company: user.company,
                            tasksComplete: {}
		    			}

		    			usersDB.insert(protectedUser, function (er, body, headers) {
						  if (er) {
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
        var isAd = req.user.admin;
        var isPriv = req.user.privileged;
        if(!isAd) {
            isAd = false;
        }
        if(!isPriv) {
            isPriv = false;
        }
        var response = {
            authenticated: true,
            admin: isAd,
            privileged: isPriv
        }
        res.status(200).json(response);
    });

    app.get('/api/game/description', function(req, res) {
    
        fs.readFile(gameConfigPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            } else {
                var json = JSON.parse(data);
                res.status(200).json(json.description);
            }
        });
    });

    app.get('/api/admin/fullGame', isLoggedIn, isAdmin, function(req, res) {
        fs.readFile(gameConfigPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            } else {
                var json = JSON.parse(data);
                res.status(200).json(json);
            }
        });
    });

    app.get('/api/admin/allImages', isLoggedIn, isAdmin, function(req, res) {
        fs.readdir(imagesPath, (err, files) => {
            if(err) {
                console.log(err);
                res.status(400).json(err);
            } else {
                res.status(200).json(files);
            }
        });
    });

    app.get('/api/game/progress', isLoggedIn, isAdmin, function(req, res) {
        var query = {
            selector: {
                _id: { 
                    $gt: 0
                }
            },
            fields: [
                "email",
                "firstName",
                "lastName",
                "company",
                "tasksComplete"
            ]
        };
        usersDB.find(query, function(err, result) {
            if (err){
                res.status(400).json(err);
            } else {
                res.status(200).json(result.docs);
            }
        });
    });

    app.post('/api/admin/fullGame', isLoggedIn, isAdmin, function(req, res) {
        if(!req.body || !req.body.game) {
            res.status(400).json({error: 'no game found in post body'});
        } else {
            fs.writeFile(gameConfigPath, JSON.stringify(req.body.game, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    res.status(400).json(err);
                } else {
                    console.log("Game Settings Updated!");
                    res.status(200).json({'saved': true});
                }
            });
        }
    });

    // LOGOUT ==============================
    app.get('/api/logout', function(req, res) {
        req.logout();
        res.status(200).send({loggedOut: true});
    });


	//========== API Routes Below =============

	app.get('/api/tasks', isLoggedIn, (req, res) => {
        fs.readFile(gameConfigPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                var tasks = JSON.parse(data).tasks;

                usersDB.get(req.user._id, function(err, user) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        for (var i = 0; i < tasks.length; i++) {
                            tasks[i].complete = user.tasksComplete[i];
                        }
                        res.status(200).send(tasks);
                    }
                });
            }
        });
	});

	app.get('/api/task', isLoggedIn, (req, res) => {

		var task_index = req.query.task_id;

        //inject req.user info about that task in here

        fs.readFile(gameConfigPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {

                var task = JSON.parse(data).tasks[task_index];

                task.clue = JSON.parse(data).clues[task.clue_id];

                usersDB.get(req.user._id, function(err, user) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        task.complete = user.tasksComplete[task_index];
                        res.status(200).send(task);
                    }
                });
            }
        });
	});


	app.post('/api/task/complete', isLoggedIn, (req, res) => {
		var id = req.body.task_id;
		usersDB.get(req.user._id, function(err, data) {
			if (err) {
				res.status(500).send(err.message);
			} else {
                var user = data;
                if(!user.tasksComplete) {
                    user.tasksComplete = {};
                }
                user.tasksComplete[id] = true;
                usersDB.insert(user, function (er, body, headers) {
                  if (er) {
                    res.status(500).send("Failed to Mark task complete");
                  } else {
                    res.status(200).send("Successfully Marked Complete");
                  }
                });
			}
		});
	});

    app.get('/api/user/clues', isLoggedIn, (req, res) => {

        usersDB.get(req.user._id, function(err, user) {
            if (err) {
                res.status(500).send(err.message);
            } else {

                fs.readFile(gameConfigPath, 'utf8', (error, data) => {
                    if (error) {
                        console.log(error);
                        res.status(500).json(error);
                    } else {
                        var fullGameData = JSON.parse(data);
                        var clues = fullGameData.clues;
                        for (var t in user.tasksComplete) {
                            if(user.tasksComplete[t]){
                                clues[fullGameData.tasks[t].clue_id].complete = true;
                            }
                        }
                        res.status(200).json(clues);
                    }
                });
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

    res.status(401).send('unauthenticated');
}

// route middleware to ensure user is admin
function isAdmin(req, res, next) {
    if (req.user.admin){
        return next();
    }
    res.status(401).json({'admin': false});
}

// route middleware to ensure user is admin
function isPrivileged(req, res, next) {
    if (req.user.privileged){
        return next();
    }
    res.status(401).json({'privileged': false});
}

// function ensureSec(req, res, next){
//     if (req.headers["X-Forwarded-Proto"] === "https"){
//        return next();
//     }
//     var fullUrl_Secure = "https://" + req.headers.host + req.url;
//     res.redirect(fullUrl_Secure);  
// };