

var configDB = require('../config/database');

// Load the Cloudant library.
var Cloudant = require('cloudant');
var bcrypt   = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');

// Initialize Cloudant with settings from .env
var username = configDB.db_creds.username;
var password = configDB.db_creds.password;
var cloudant = Cloudant({account:username, password:password});

var usersDB = cloudant.db.use(configDB.db_creds.usersDBName);

const fs = require('fs');

var gameConfigPath = 'server/config/game.json';
var gameData = require('../config/game.json');
var imagesPath = 'dist/assets/clue_images'; //images must be in src/assets/clue_images folder when deployed


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

    app.post('/api/forgot', function(req, res) {
        var emailToSendTo = req.body.email;

        async.waterfall([
            function(done) {
                console.log('generating crypto')
              crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
              });
            },
            function(token, done) {
                console.log('getting user')
                usersDB.find({selector: {email: emailToSendTo, password: { $exists: true}}}, function(err, result) {
                    if (err){
                        return res.status(400).send("No account with that email exists");
                    } else {
                        if(result.docs.length <= 0){
                            return res.status(400).send("No account with that email exists");
                        } else {
                            var user = result.docs[0];

                            user.resetPasswordToken = token;
                            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                            console.log('updating user')

                            usersDB.insert(user, function (er, body, headers) {
                              if (er) {
                                return res.status(500).send("Failed to update user with password reset");
                              } else {
                                done(er, token, user);
                              }
                            });
                        }
                    }
                });
            },
            function(token, user, done) {
                console.log('sending email')
                // using SendGrid's v3 Node.js Library
                // https://github.com/sendgrid/sendgrid-nodejs
                var helper = require('sendgrid').mail;
                var fromEmail = new helper.Email('clue@bankersToolbox.com');
                var toEmail = new helper.Email(emailToSendTo);
                var subject = 'Clue Password Reset';
                var resetLink = 'https://clue.mybluemix.net/reset/' + token;
                var htmlMessage = "<p>Hi There!</p><p>Here is your password reset link for Banker's Toolbox Clue!</p><br><a href="+resetLink+">Reset Password</a><br><p>If you didn't initiate this, please ignore this email.</p><br><p>- Luke @ BringIt Clue!</p>"
                var content = new helper.Content('text/html', htmlMessage);
                var mail = new helper.Mail(fromEmail, subject, toEmail, content);

                var sg = require('sendgrid')('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');
                var request = sg.emptyRequest({
                  method: 'POST',
                  path: '/v3/mail/send',
                  body: mail.toJSON()
                });

                sg.API(request, function (error, response) {
                  if (error) {
                    console.log('Error response received');
                    return res.status(500).send(error);
                  }
                  console.log('sending reset email to', req.body.email);
                  // console.log(response.statusCode);
                  // console.log(response.body);
                  // console.log(response.headers);
                  return res.status(200).send({sent: 'ok', email: emailToSendTo});
                });
              
            }
          ], function(err) {
            console.log('something went wrong');
            if (err) return next(err);
            return res.status(400).send({sent: 'no', error: 'something went wrong'});
          });
        
    });

    app.post('/api/resetPassword', function(req, res) {
        usersDB.find({selector: {resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() }}}, function(err, result) {
            if (err){
                return res.status(400).send("Password reset has expired, or not been initiated yet - please reset your password again");
            } else {
                if(result.docs.length <= 0){
                    return res.status(400).send("Password reset has expired, or not been initiated yet - please reset your password again");
                } else {
                    var user = result.docs[0];

                    delete user.resetPasswordToken;
                    delete user.resetPasswordExpires; // 1 hour

                    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);

                    console.log('updating user password');

                    usersDB.insert(user, function (er, body, headers) {
                      if (er) {
                        return res.status(500).send("Failed to update user with new password");
                      } else {
                        return res.status(200).send("Password Reset!");
                      }
                    });
                }
            }
        });
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/login'
        }));

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
        res.status(200).json(gameData.description);
    });

    app.get('/api/admin/fullGame', isLoggedIn, isAdmin, function(req, res) {
        res.status(200).json(gameData);
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
                    gameData = JSON.parse(JSON.stringify(req.body.game, null, 4)); // update gameData
                    console.log("Game Settings Updated!");
                    res.status(200).json({'saved': true});
                }
            });

            //should reset all progress of users so it doesn't break anything
        }
    });

    // LOGOUT ==============================
    app.get('/api/logout', function(req, res) {
        req.logout();
        req.session.destroy(function (err) {
            res.status(200).send({loggedOut: true});
        });
    });


	//========== API Routes Below =============

	app.get('/api/tasks', isLoggedIn, (req, res) => {
        var tasks = JSON.parse(JSON.stringify(gameData)).tasks;
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
	});

	app.get('/api/task', isLoggedIn, (req, res) => {

		var task_index = req.query.task_id;

        //inject req.user info about that task in here
        var task = JSON.parse(JSON.stringify(gameData)).tasks[task_index];

        task.clue = JSON.parse(JSON.stringify(gameData)).clues[task.clue_id];

        usersDB.get(req.user._id, function(err, user) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                task.complete = user.tasksComplete[task_index];
                res.status(200).send(task);
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

                var fullGameData = JSON.parse(JSON.stringify(gameData));
                var clues = fullGameData.clues;
                for (var t in user.tasksComplete) {
                    if(user.tasksComplete[t]){
                        clues[fullGameData.tasks[t].clue_id].complete = true;
                    }
                }
                res.status(200).json(clues);
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