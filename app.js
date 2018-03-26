"use strict";

var http = require("http");
var express = require("express");
var crypto = require("crypto");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongodb = require("mongodb-stitch");

/* We will be using the following quite frequently... (dev + accessing db) */
const LOCALPORT = 3000;
let appId = "<Insert APP ID here>"; /* Insert APP ID in the angle brackets */
let stitchClientPromise = mongodb.StitchClientFactory.create(appId);

/* Want to authenticate anonymously */
stitchClientPromise.then(stitchClient => stitchClient.login())
    .then(() => console.log("logged in!"))
    .catch(e => console.log("error: ", e));

var app = express();
app.use(morgan("dev"));
app.use(express.static("frontend"));
app.use(bodyParser.json());

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

app.post("/api/login/", function(req, res, next) {
    stitchClientPromise.then(stitchClient => {
        let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
        let collection = db.collection("users");
        return collection.find({ username: req.body.username }).execute();
    })
        .then(result => {
            console.log(result);
            if(result.length < 1) {
                res.status(200).send({noFoundUser:true});
            } else {
                var currSaltedHashPwd = createSaltedHash(req.body.password, result[0].salt);
                if(currSaltedHashPwd === result[0].password) {
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

    /*if(!isFound) {
        stitchClientPromise.then(stitchClient => {
            let db = stitchClient.service("mongodb", "mongodb-atlas").db("p_r");
            let collection = db.collection("users");

            console.log("Please tell me this runs...");
            res.status(200).send({validUser: true});
            return collection.insertOne(user);
        })
            .then(result => console.log(result))
            .catch(err => res.status(500).send("Database error: " + err));
    } else {
        res.status(200).send({validUser: false});
    }

    if(!isFound) {
        res.status(200).send({validRegistration:true});
    } else {
        res.status(200).send({validRegistration:false});
    }*/
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