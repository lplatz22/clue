//passport.js

var LocalStrategy    = require('passport-local').Strategy;
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
        usersDB.find({selector: {email: email}}, function(err, result) {
            if (err){
                console.log("There was an error finding the user: " + err);
                return done(null, false, { message : "Internal Server Error" } );
            } else if (result.docs.length == 0){
                console.log("User was not found");
                return done(null, false, { message : "Incorrect email" } );
            }

            var user = result.docs[0];

            //User found
            if (bcrypt.compareSync(password, user.password)) {
                console.log("Password matches");
                return done(null, user); // all is well, return successful user
            } else {
                console.log("Password is not correct");
                return done(null, false, { message :"Incorrect password"} );
            }  
        });
      }
    ));
};