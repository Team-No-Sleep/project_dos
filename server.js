require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var passport = require("passport");
var session = require("express-session");
var server = require("http").createServer(express);
var socketio = require("socket.io")(server);
var chatbot = require("./routes/chatbot");
var request = require("request");
var userId;

var db = require("./models");
var keys = require("./keys");

var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

var app = express();
var PORT = process.env.PORT || 3000;
var server_host = process.env.YOUR_HOST || "0.0.0.0";
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
  // console.log(user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new LinkedInStrategy(
    {
      clientID: keys.keys.id,
      clientSecret: keys.keys.secret,
      callbackURL: "http://localhost:3000/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_basicprofile"],
      state: true
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function() {
        // This checks if the username is already in the database, if not, adds the
        // user to the database
        // console.log(profile.id);
        // console.log(profile.name);
        db.User.findOrCreate({
          where: { linkedInId: profile.id },
          defaults: {
            linkedInId: profile.id,
            name: profile.name.givenName + " " + profile.name.familyName
          }
        }).spread((user, created) => {
          // userId = user.id;
          // request.post("http://localhost:3000/api/user", {
          //   form: {
          //     userId: user.id
          //   },
          //   headers: {
          //     "Content-Type": "application/x-www-form-urlencoded"
          //   }
          // });
          console.log(
            user.get({
              plain: true
            })
          );

          console.log(user.id);
        });

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
    helpers: {
      json: object => JSON.stringify(object || null)
    }
  })
);
app.set("view engine", "handlebars");

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app, ensureAuthenticated);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  //http port
  app.listen(PORT, server_host, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
  //server port
  fromClient();
  server.listen(8010);
});

//connecting socket.io and DialogFlow
function fromClient() {
  socketio.on("connection", function(socket) {
    socket.on("fromClient", function(data) {
      console.log(data);
      chatbot.textQuery(data.client, data.sessionId).then(function(res) {
        console.log("Sample is done.");
        console.log(res);
        socket.emit("fromServer", {
          server: res.response,
          sessionId: res.sessionId,
          uiMetaData: data.uiMetaData
        });
        if (res.jobSearchParams !== null) {
          socket.emit("jobSearch", res.jobSearchParams);
        }
      });
    });

    socket.on("clientEvent", function(data) {
      console.log(data);
      chatbot
        .eventQuery(data.client, data.sessionId, data.params)
        .then(function(res) {
          console.log("Sample is done.");
          console.log(res);
          socket.emit("fromServer", {
            server: res.response,
            sessionId: res.sessionId,
            uiMetaData: data.uiMetaData
          });
        });
    });
  });
}
module.exports = { app, fromClient };
