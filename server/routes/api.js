const express = require('express');
const router = express.Router();

var db_creds = {
  "username": "0bf7cb07-f110-4646-b2a7-a61709497bb8-bluemix",
  "password": "028c5283dfbe04348bc8afc24c7284e34a312b8810fb666231f21d78484d670a",
  "host": "0bf7cb07-f110-4646-b2a7-a61709497bb8-bluemix.cloudant.com",
  "port": 443,
  "url": "https://0bf7cb07-f110-4646-b2a7-a61709497bb8-bluemix:028c5283dfbe04348bc8afc24c7284e34a312b8810fb666231f21d78484d670a@0bf7cb07-f110-4646-b2a7-a61709497bb8-bluemix.cloudant.com"
}

// Load the Cloudant library.
var Cloudant = require('cloudant');

// Initialize Cloudant with settings from .env
var username = db_creds.username;
var password = db_creds.password;
var cloudant = Cloudant({account:username, password:password});

var tasksDB = cloudant.db.use('tasks');

/* GET api listing. */
router.get('/', (req, res) => {
  	res.status(200).send('api works');
});

router.get('/tasks', (req, res) => {
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

router.get('/task', (req, res) => {

	var id = req.query.task_id;

	tasksDB.get(id, function(err, data) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.status(200).send(data);
		}
	});
});


router.post('/login', (req, res) => {
	// console.log(req.body.user); //email and password fields exist
	if(req.body.user.email == "luke@example.com" && req.body.user.password == "pass"){
		res.status(200).send({message: "ok"});
	} else {
		res.status(200).send({message: "incorrect username"});
		//TODO: send new status and have app accept that
	}
});

router.post('/register', (req, res) => {
	// console.log(req.body.user); //email and password fields exist
	if(req.body.user.email === "luke@example.com" && req.body.user.passwordConfirm === "pass" && req.body.user.password === "pass" && req.body.user.company === "IBM"){
		res.status(200).send({message: "ok"});
	} else {
		res.status(200).send({message: "invalid register"});
		//TODO: send new status and have app accept that
	}
});

module.exports = router;