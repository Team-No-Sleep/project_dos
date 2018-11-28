var db = require("../models");
var passport = require("passport");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  app.post("/api/examples", function(req, res) {
    db.Example.create({
      jobtitle: req.body.jobtitle,
      company: req.body.company,
      city: req.body.city,
      state: req.body.state,
      date: req.body.date,
      snippet: req.body.snippet,
      url: req.body.url
    }).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });

  //return the user the user to the login page
  app.get(
    "/auth/linkedin/callback",
    passport.authenticate("linkedin", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );
};
