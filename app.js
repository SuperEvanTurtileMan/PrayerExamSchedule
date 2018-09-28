"use strict";

var http = require("http");
var express = require("express");
var crypto = require("crypto");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var session = require("express-session");
var mongodb = require("mongodb-stitch");

/* We will be using the following quite frequently... (dev + accessing db) */
const LOCALPORT = 3000;
let appId = "prayerreq-fqljb"; /* Insert APP ID in the angle brackets */
let stitchClientPromise = mongodb.StitchClientFactory.create(appId);

/* Want to authenticate anonymously */
stitchClientPromise.then(stitchClient => stitchClient.login())
    .then(() => console.log("logged in!"))
    .catch(e => console.log("error: ", e));

/* What the app will be using */
var app = express();
app.use(morgan("dev"));
app.use(express.static("frontend"));
app.use(bodyParser.json());
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
}));


/* Objects */
var userObj = function(curr_username, curr_password,
                curr_salt, curr_firstname, curr_lastname, curr_remainingPosts) {
    return {
        username: curr_username,
        password: curr_password,
        salt: curr_salt,
        firstname: curr_firstname,
        lastname: curr_lastname,
        remainingPosts: curr_remainingPosts
    };
};

app.post("/api/logout/", function(req, res, next) {
    if(!req.session.username) {
        res.status(403).end("Unauthorized - you cannot log out when you haven't logged in.");
    } else {
	req.session.destroy();
	return res.status(200);
    }
});

app.post("/api/login/", function(req, res, next) {
    stitchClientPromise.then(stitchClient => {
        let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
        let collection = db.collection("users");
        return collection.find({ username: req.body.username }).execute();
    })
        .then(result => {
            if(result.length < 1) {
                res.status(200).send({noFoundUser:true});
            } else {
                var currSaltedHashPwd = createSaltedHash(req.body.password, result[0].salt);
                if(currSaltedHashPwd === result[0].password) {
                    req.session.username = result[0].username;
                    req.session.firstname = result[0].firstname;
                    //req.cookie("username", result[0].username);
                    res.status(200).send({validLogin:true});
                } else {
                    res.status(200).send({validLogin:false});
                }
            }
        })
        .catch(err => res.status(500).send("Database error" + err));
});

app.post("/api/register/", function(req, res, next) {
    var salt = crypto.randomBytes(16).toString("base64");
    var encryptedPassword = createSaltedHash(req.body.password, salt);
    var user = userObj(req.body.username, encryptedPassword, salt, req.body.firstname, req.body.lastname, 8);
 
    stitchClientPromise.then(stitchClient => {
        let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
        let collection = db.collection("users");
        return collection.find({ username: user.username }).execute();
    })
        .then(result => {
            if(result.length > 0) {
                res.status(200).send({validRegistration:false});
            } else {
                stitchClientPromise.then(stitchClient => {
                    let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
                    let collection = db.collection("users");

                    return collection.insertOne(user);
                })
                    .then(result => console.log(result))
                    .catch(err => res.status(500).send("Database error: " + err));
                res.status(200).send({validRegistration:true});
            }
        })
        .catch(err => res.status(500).send("Database error: " + err));
});

app.get("/api/getuserinfo/", function(req, res) {
    if(!req.session.username) {
        res.status(403).end("Unauthorized access: User is not logged in.");
    } else {
        stitchClientPromise.then(stitchClient => {
            let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
            let collection = db.collection("users");
            return collection.find({ username: req.session.username }).execute();
        })
            .then(result => {
                res.status(200).send(result);
            })
            .catch(err => res.status(500).send("Database error: " + err));
    }
});

app.post("/api/addrequest/", function(req, res) {
    if(!req.session.username) {
        res.status(403).end("Unauthorized access: User is not logged in.");
    } else {
        stitchClientPromise.then(stitchClient => {
            let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
            let collection = db.collection("requests");
            return collection.insertOne(req.body);
        })
            .then(result => res.status(200).send("Successful!"))
            .catch(err => res.status(500).send("Database error: " + err));
    }
});

app.get("/api/getfirstname/", function(req, res) {
    if(!req.session.username) {
        return res.status(403).end("Unauthorized access: User is not logged in.");
    }
    return res.status(200).send(req.session.firstname);
});

app.get("/api/getrequests/", function(req, res) {
    if(!req.session.username) {
        res.status(403).end("Unauthorized access: User is not logged in.");
    } else {
        stitchClientPromise.then(stitchClient => {
            let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
            let collection = db.collection("requests");
            return collection.find({username: req.session.username}).execute();
        })
            .then(result => res.status(200).send(result))
            .catch(err => res.status(500).send("Database error: " + err));
    }
});

app.post("/api/deletereq", function(req, res) {
    if(!req.session.username) {
        return res.status(403).end("Unauthorized access: User is not logged in to perform this action!");
    }

    stitchClientPromise.then(stitchClient => {
        let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
        let collection = db.collection("requests");
        return collection.deleteOne({username: req.session.username, prayerRequest: req.body.requestName, hour: req.body.hour, minute: req.body.minute});
    })
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send("Database error: " + err));
});

// This is for the agenda portion of the application
app.post("/api/getglobalreq/", function(req, res) {
    if(!req.session.username) {
        return res.status(403).end("Unauthorized access: User is not logged in to view all requests.");
    }
    stitchClientPromise.then(stitchClient => {
        let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
        let collection = db.collection("requests");
        return collection.find({month: req.body.month, date: req.body.date, year: req.body.year}).execute();
    })
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send("Database error: " + err));
});

// Get all of the requests of the current month.
app.post("/api/getCurrMonthReq/", function(req, res) {
    if(!req.session.username) {
        return res.status(403).end("Unauthorized access: User is not logged in to view all requests.");
    }

    stitchClientPromise.then(stitchClient => {
        let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
        let collection = db.collection("requests");
        return collection.find({month:req.body.month}).execute();
    })
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send("Database error: " + err));
});

app.get("/api/getcalendar/", function(req, res) {
    if(!req.session.username) {
        return res.status(403).end("Unauthorized access: User is not logged in to view calendar.");
    }

    stitchClientPromise.then(stitchClient => {
        let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
        let collection = db.collection("calendar");
        return collection.find({year: 2018}).execute();
    })
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send("Database error: " + err));
});

/* Helper functions */
var createSaltedHash = function(password, salt) {
    var hash = crypto.createHmac("sha512", salt);
    hash.update(password);
    return hash.digest("base64");
};

app.listen(process.env.PORT || LOCALPORT, function() {
    console.log("Application running on PORT " + LOCALPORT);
});