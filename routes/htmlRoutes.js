var db = require("../models");
var passport = require("passport");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    //console.log(db);
    db.Job.findAll({}).then(function(dbJobs) {
      res.render("index", {
        msg: "Welcome!",
        jobs: dbJobs,
        user: req.user
      });
    });
  });

  //load chat bot
  app.get("/chat", function(req, res) {
    res.render("chat", {
      user: req.user
    });
  });

  // Load job page and pass in an job by id
  app.get("/job/:id", function(req, res) {
    db.Job.findOne({ where: { id: req.params.id } }).then(function(dbJob) {
      res.render("job", {
        job: dbJob
      });
    });
  });

  //let the user get authenticated to log into the account
  app.get("/auth/linkedin", passport.authenticate("linkedin"), function() {
    console.log("am i here?");
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  });

  //let the user logout
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
