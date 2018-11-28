var db = require("../models");
var passport = require("passport");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    //console.log(db);
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples,
        user: req.user
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
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
