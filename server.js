require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var passport = require("passport");
var session = require("express-session");
var server = require("http").createServer(express);
var socketio = require("socket.io")(server);
var chatbot = require("./public/js/chatbot");

var db = require("./models");
var keys = require("./keys");

var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({ secret: "keyboard cat" }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Linkedin profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new LinkedInStrategy(
    {
      clientID: keys.linkedInKeys.id,
      clientSecret: keys.linkedInKeys.secret,
      callbackURL: "http://localhost:3000/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_basicprofile"],
      state: true
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function() {
        // To keep the example simple, the user's LinkedIn profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the LinkedIn account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    //added the helpers in case it might be needed later
    helpers: {}
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  //http port
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
  //server port
  server.listen(8010);
});
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
var dialogFlow = new chatbot.DialogFlow();
//connecting socket.io and DialogFlow
var fromClient = function() {
  socketio.on("connection", function(socket) {
    socket.on("fromClient", function(data) {
      dialogFlow.sendTextMessageToDialogFlow(data.client, sessionId);
      // api.getRes(data.client).then(function(res) {
      //   socket.emit("fromServer", { server: res });
      // });
    });
  });
};
module.exports = { app, fromClient };
