
var express = require('express');
var app = module.exports = express();

var passport = require('passport');
var util = require('util');
var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var config = require('../../config').Config;

passport.use(new GitHubStrategy({
    clientID: config.auth.github.clientID,
    clientSecret: config.auth.github.clientSecret,
    callbackURL: config.auth.github.clientCallback
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.use(express.session({ secret: 'slashats-super-duper-secret-needs-to-be-updated' }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github', passport.authenticate('github'),
  function(req, res){ }
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/github' }), // Infinite loop
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && [183679, 1025989].indexOf(req.user.id) !== -1) { return next(); }
  res.redirect('/auth/github')
}