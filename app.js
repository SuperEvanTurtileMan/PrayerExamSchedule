"use strict";

var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongodb = require("mongodb-stitch");

const LOCALPORT = 3000;
let appId = "prayerreq-fqljb"; // Insert APP ID in the angle brackets
let stitchClientPromise = mongodb.StitchClientFactory.create(appId);

/* Want to authenticate anonymously */
stitchClientPromise.then(stitchClient => stitchClient.login())
    .then(() => console.log("logged in!"))
    .catch(e => console.log("error: ", e));

//const client = new mongodb.stitchClient("prayerreq-fqljb"); <APP ID>
//const db = client.service("mongodb", "mongodb-atlas").db("p_r"); <DATABASE USAGE>

var app = express();
app.use(morgan("dev"));
app.use(express.static("frontend"));
app.use(bodyParser.json());

app.listen(process.env.PORT || LOCALPORT, function() {
    console.log("Application running on PORT " + LOCALPORT);
});