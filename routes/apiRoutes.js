var request = require("request");
var db = require("../models");
var passport = require("passport");
var keys = require("../keys");

module.exports = function(app) {
  // Get all unsaved jobs not saved by the user
  app.get("/api/jobs/:userTableId", function(req, res) {
    db.Job.findAll({
      where: {
        saved: 0,
        UserId: req.params.userTableId
      }
    }).then(function(dbJobs) {
      res.json(dbJobs);
    });
  });

  // Get saved jobs for given user
  app.get("/api/jobs/saved/:userTableId", function(req, res) {
    db.Job.findAll({
      where: {
        saved: 1,
        UserId: req.params.userTableId
      }
    }).then(function(dbJobs) {
      res.json(dbJobs);
    });
  });

  // Gets jobs returned by github and Authentic job search APIs
  app.get("/api/jobs/:apiName/:job/:location/:fullTime", function(req, res) {
    //console.log(req.body.data);
    var data;
    var apiName = req.params.apiName;
    var query = "";
    //console.log(keys.keys.authenticApiKey);
    if (apiName === "authentic") {
      var query = req.params.job;
      var location = req.params.location;
      var queryURL =
        "https://authenticjobs.com/api/?api_key=" +
        keys.keys.authenticApiKey +
        "&format=json" +
        "&method=aj.jobs.search" +
        "&keywords=" +
        query +
        "&location=" +
        location +
        "";
    } else if (apiName === "github") {
      var query = req.params.job;
      var location = req.params.location;
      var fullTime = req.params.fullTime;
      var queryURL =
        "https://jobs.github.com/positions.json?description=" +
        query +
        "&full_time=" +
        fullTime +
        "&location=" +
        location +
        "";
    } else if (apiName === "gov") {
      var fullTime;
      if (req.params.fullTime) {
        fullTime = "fulltime";
      } else {
        fullTime = "parttime";
      }
      var location = req.params.location;
      var query = fullTime + "+" + req.params.job + "+" + "jobs+in+";
      var location = req.params.location;
      var queryURL =
        "https://jobs.search.gov/jobs/search.json?query=" +
        query +
        location +
        "";
    }
    console.log(queryURL);
    request(queryURL, { json: true }, (err, result, body) => {
      if (err) {
        return console.log(err);
      }
      console.log(body);
      //console.log(body.listings.listing[0].title);
      if (apiName === "authentic") {
        data = body.listings.listing;
      } else if (apiName === "github") {
        data = body;
      } else if (apiName === "gov") {
        data = body;
      }
      res.send(data);
    });
  });

  // Posts jobs to the database
  app.post("/api/jobs/:apiName/:userTableId", function(req, res) {
    //console.log("start save jobs");
    if (req.params.apiName === "github") {
      db.Job.create({
        jobtitle: req.body.title,
        company: req.body.company,
        location: req.body.location,
        date: req.body.created_at,
        snippet: "",
        url: req.body.how_to_apply,
        type: req.body.type,
        saved: false,
        applied: false,
        UserId: req.params.userTableId
      }).then(function(dbJob) {
        res.json(dbJob);
      });
    } else if (req.params.apiName === "authentic") {
      db.Job.create({
        jobtitle: req.body.title,
        company: req.body.company.name,
        location: req.body.company.location.name,
        date: req.body.post_date,
        snippet: "",
        url: req.body.url,
        type: req.body.type.name,
        saved: false,
        applied: false,
        UserId: req.params.userTableId
      }).then(function(dbJob) {
        res.json(dbJob);
      });
    }
  });

  // Delete unsaved jobs
  app.delete("/api/jobs", function(req, res) {
    db.Job.destroy({
      where: {
        saved: 0
      }
    }).then(function(dbJob) {
      res.json(dbJob);
    });
  });

  // Delete a saved job by id
  app.delete("/api/jobs/:id", function(req, res) {
    db.Job.destroy({ where: { id: req.params.id } }).then(function(dbJob) {
      res.json(dbJob);
    });
  });

  // Update saved status of a job
  app.put("/api/jobs/:id", function(req, res) {
    db.Job.update(
      {
        saved: 1
      },
      {
        where: {
          id: req.params.id
        }
      }
    ).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  //return the user the user to the login page
  //move this auth route to its own javascript file authController.js and rename
  //routes to controllers
  app.get(
    "/auth/linkedin/callback",
    passport.authenticate("linkedin", {
      successRedirect: "/chat",
      failureRedirect: "/"
    })
  );
  //**********************************/

  // Returns the id of the user in the jobs table
  app.get("/api/user/:userId", function(req, res) {
    //console.log(req.params.userId);
    db.User.findAll({
      where: {
        linkedInId: req.params.userId
      },
      attributes: ["id"]
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });
};
