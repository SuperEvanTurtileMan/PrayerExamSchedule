"use strict";

var mongodb = require("mongodb-stitch");

var creat_calendar = function() {
    var dates = [];
    var year = 2018;
    var start_month = 4;
    var end_month = 12;

    // We start with Sunday, April 1st. When using this next year, BE SURE TO CHANGE THE DAYS!
    // This is crucial for the algorithm on detecting which is the first day of each month.
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var daysPtr = 0; // We start on Sunday, April 1.

    // Work on the months first!
    for(var i = start_month; i <= end_month; i++) {
        var day_lim;

        if(i === 4 || i === 6 || i === 9 || i === 11) {
            // These months will contain ONLY thirty days.
            day_lim = 30;

            // WORK ON IN FUTURE: Change value of this month if I do not want to affect daysPtr.
            // Usually transitioning from a month with 31 days to the current month with 30 days
            if(i !== 4) {
                daysPtr += 3;
                if(daysPtr >= 7) {
                    daysPtr = daysPtr - 7;
                }
            }
        } else if(i === 1 || i === 3 || i === 5 || i === 7 || i === 8 || i === 10 || i === 12) {
            // These months will contain ONLY thirty-one days.
            day_lim = 31;

            // Usually transitioning from a month with 30 days to the current month with 31 days
            // that is not August...
            if(i !== 8) daysPtr += 2;
            else daysPtr += 3;

            if(daysPtr >= 7) {
                daysPtr = daysPtr - 7;
            }
        } else {
            // February usually contains 28 days... unless it is a leap year, which makes it 29 days.
            if(year % 4 === 0) {
                // The daysPtr always moves 1 every leap year. Check out the calendar to confirm that!
                day_lim = 29;
            } else {
                // The daysPtr does not change here. This is a part of the algorithm.
                day_lim = 28;
            }
        }

        /* Mini-"Pseudo" Algorithm to find out which is the first day of each month */
        // Working on dates now!
        for(var j = 1; j <= day_lim; j++) {
            var currDaysPtr = daysPtr;  // We use a helper variable so that we don't destroy the point of reference!

            if(j % 7 === 1) {
                if(currDaysPtr >= 7) {
                    currDaysPtr = currDaysPtr - 7;
                }
            } else if(j % 7 === 2) {
                currDaysPtr++;
                if(currDaysPtr >= 7) {
                    currDaysPtr = currDaysPtr - 7;
                }
            } else if(j % 7 === 3) {
                currDaysPtr += 2;
                if(currDaysPtr >= 7) {
                    currDaysPtr = currDaysPtr - 7;
                }
            } else if(j % 7 === 4) {
                currDaysPtr += 3;
                if(currDaysPtr >= 7) {
                    currDaysPtr = currDaysPtr - 7;
                }
            } else if(j % 7 === 5) {
                currDaysPtr += 4;
                if(currDaysPtr >= 7) {
                    currDaysPtr = currDaysPtr - 7;
                }
            } else if(j % 7 === 6) {
                currDaysPtr += 5;
                if(currDaysPtr >= 7) {
                    currDaysPtr = currDaysPtr - 7;
                }
            } else {
                currDaysPtr += 6;
                if(currDaysPtr >= 7) {
                    currDaysPtr = currDaysPtr - 7;
                }
            }
            dates.push({month: i, date: j, year: year, day: days[currDaysPtr]});
        } 
    }

    // Put it into the database
    let appId = "prayerreq-fqljb"; /* Insert APP ID in the angle brackets */
    let stitchClientPromise = mongodb.StitchClientFactory.create(appId);

    stitchClientPromise.then(stitchClient => stitchClient.login())
        .then(() => {
            console.log("logged in!");

            stitchClientPromise.then(stitchClient => {
                let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
                let collection = db.collection("calendar");
                return collection.find({year: 2018}).execute();
            })
                .then(result => {
                    if(result.length === 0) {
                        stitchClientPromise.then(stitchClient => {
                            let db = stitchClient.service("mongodb", "mongodb-atlas").db("test");
                            let collection = db.collection("calendar");
                            return collection.insertMany(dates);
                        })
                            .then(result => console.log("Successfully performed!"))
                            .catch(err => console.log("Database error! " + err));
                    } else {
                        console.log("These dates exist!");
                    }
                })
                .catch(err => console.log("Database error! " + err));

        })
        .catch(e => console.log("error: ", e));

    return dates;
}


creat_calendar();
//console.log(creat_calendar());