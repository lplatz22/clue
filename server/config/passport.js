//passport.js

var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt   = require('bcrypt-nodejs');

// load up the user model
// var User       = require('../app/models/user');

var configAuth = require('./auth');

var configDB = require('./database');

// Load the Cloudant library.
var Cloudant = require('cloudant');

// Initialize Cloudant with settings from .env
var cloudant = Cloudant({account:configDB.db_creds.username, password:configDB.db_creds.password});

var usersDB = cloudant.db.use(configDB.db_creds.usersDBName);


module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        // User.findById(id, function(err, user) {
        //     done(err, user);
        // });
        done(null, user);
    });
    
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
      function(req, email, password, done) {
        email = email.toLowerCase();
        usersDB.find({selector: {email: email, password: { $exists: true}}}, function(err, result) {
            if (err){
                return done(null, false, { message : "Internal Server Error" } );
            } else if (result.docs.length == 0){
                return done(null, false, { message : "Incorrect email" } );
            }

            var user = result.docs[0];

            //User found
            if (bcrypt.compareSync(password, user.password)) {
                return done(null, user); // all is well, return successful user
            } else {
                return done(null, false, { message :"Incorrect password"} );
            }  
        });
      }
    ));

    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'name', 'email']

    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            usersDB.find({selector: {facebookID: profile.id}}, function(err, result) {
                if (err){
                    console.log(err);
                    return done(null, false, { message : "Internal Server Error" } );
                }

                if(result.docs.length == 0){
                    console.log('about to insert new facebook user');

                    var userEmail = "facebook_email";
                    if(profile.emails && profile.emails.length > 0){
                        userEmail = profile.emails[0].value;
                    }

                    var facebookUser = {
                        email: userEmail,
                        token: token,
                        facebookID: profile.id,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        company: "",
                        tasksComplete: {}
                    }

                    usersDB.insert(facebookUser, function (er, body, headers) {
                      if (er) {
                        console.log('error inserting facebook user');
                        return done(null, false, { message : "Internal Server Error" } );
                      } else {
                        console.log('success inserting facebook user');
                        usersDB.find({selector: {facebookID: profile.id}}, function(err, result) {
                            if (err){
                                console.log(err);
                                return done(null, false, { message : "Internal Server Error" } );
                            } else {
                                if(result.docs.length == 0) {
                                    return done(null, false, { message : "Internal Server Error - Failed to find user after insert" } );
                                } else{
                                    return done(null, result.docs[0]); //return the user
                                }
                            }
                        });
                      }
                    });
                } else {
                    var user = result.docs[0];
                    console.log('facebook user already found');
                    return done(null, user); // all is well, return successful user
                }
                

            });
        });

    }));
};