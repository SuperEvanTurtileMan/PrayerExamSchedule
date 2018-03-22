"use strict";

var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongodb = require("mongodb-stitch");

const LOCALPORT = 3000;
let appId = ""; /* Insert APP ID in the angle brackets */
let stitchClientPromise = mongodb.StitchClientFactory.create(appId);

/* Want to authenticate anonymously */
stitchClientPromise.then(stitchClient => stitchClient.login())
    .then(() => console.log("logged in!"))
    .catch(e => console.log("error: ", e));

var app = express();
app.use(morgan("dev"));
app.use(express.static("frontend"));
app.use(bodyParser.json());

app.post("/api/login", function(req, res, next) {
    console.log(req.body);
    res.status(200).send({validLogin: true});
});

app.listen(process.env.PORT || LOCALPORT, function() {
    console.log("Application running on PORT " + LOCALPORT);
});