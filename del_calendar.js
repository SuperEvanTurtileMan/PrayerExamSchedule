"use strict";

var mongodb = require("mongodb-stitch");

var del_calendar = function() {
    // Delete calendar
    let appId = "prayerreq-fqljb"; /* Insert APP ID in the angle brackets */
    let stitchClientPromise = mongodb.StitchClientFactory.create(appId);

    stitchClientPromise.then(stitchClient => stitchClient.login())
        .then(() => {
            console.log("logged in!");

            stitchClientPromise.then(stitchClient => {
                let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
                let collection = db.collection("calendar");
                return collection.deleteMany({year: 2018});
            })
                .then(result => console.log("Deleted!"))
                .catch(err => console.log("Database error! " + err));
        })
        .catch(e => console.log("error: ", e));
}

del_calendar();