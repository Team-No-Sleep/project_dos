var db = require("../models");
var passport = require("passport");

module.exports = function(app) {
  // Get all jobs
  app.get("/api/jobs", function(req, res) {
    db.Job.findAll({}).then(function(dbJobs) {
      res.json(dbJobs);
    });
  });

  app.post("/api/jobs", function(req, res) {
    db.Job.create({
      jobtitle: req.body.jobtitle,
      company: req.body.company,
      city: req.body.city,
      state: req.body.state,
      date: req.body.date,
      snippet: req.body.snippet,
      url: req.body.url,
      saved: false,
      applied: false
    }).then(function(dbJob) {
      res.json(dbJob);
    });
  });

  // Delete a job by id
  app.delete("/api/jobs/:id", function(req, res) {
    db.Job.destroy({ where: { id: req.params.id } }).then(function(dbJob) {
      res.json(dbJob);
    });
  });

  app.put("/api/jobs/:id", function(req, res) {
    db.Job.update(req.body, {
      where: {
        id: req.params.id
      }
    }).then(function(dbPost) {
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
};
