
var express = require('express');
var app = module.exports = express();

app.set('views', __dirname + '/views');


var auth = require('../auth');
var sh = require('shorthash');
var pg = require('pg');
var helper = require('../helper');
var bet = require('./models/bet.js');
var model_vote = require('./models/vote.js');

// ## Show all bets ordered by votes
app.get('/', function index(req, res){
    var result = bet.all(function(err, result) {
      res.render('index', { title: 'Slashbet', bets: result.rows, isAuthenticated: req.isAuthenticated() });
    });
});

// ## Show a single bet by id
app.get('/:id', function single(req, res){
  bet.getSingle(req.params.id, function(err, result) {
    if(result.rows.length !== 1)
    {
      res.redirect('/');
    }
    else
    {
      var bet = result.rows[0];
      var percent;
      if (bet.yes || bet.no)
      {
        yes = parseInt(bet.yes, 10);
        no = parseInt(bet.no, 10);
        percent = Math.round((yes / (yes+no))*100);
      }
      res.render('single', { title: bet.bet+" <small>("+bet.date+")</small>", bet: bet, percent: percent, hex: bet.color });
    }
  });
});

// ## Make your vote count!
app.get('/:id/:vote', function vote(req, res){

  if(req.params.id === undefined || req.params.vote === undefined)
  {
    res.redirect('/');
  }

  bet.getSingle(req.params.id, function(err, result) {

    if(err) return console.error(err);
    if(result.rows.length !== 1)
    {
      res.redirect('/');
    }
    else
    {
      var bet = result.rows[0];
      var clientIP = helper.getClientAddress(req);

      model_vote.get(bet.id, clientIP, function(err, result) {
        if(result.rows.length !== 0)
        {
          res.redirect('/'+req.params.id);
        } else {

          var obj = {
            bet_id: bet.id,
            ip: clientIP,
            vote: req.params.vote
          };

          model_vote.save(obj, function(err, result) {
            // Let's just hope it worked.
            // At least for now :)
            res.redirect('/'+req.params.id);
          });
        }
      });
    }
  });
});


app.post('/post', auth.ensureAuthenticated, function post(req, res) {

  var obj = {
    bet:  req.body.bet,
    hex:  helper.ipToHex(clientIP),
    date: req.body.date || new Date,
    hash: sh.unique(req.body.bet)
  };

  bet.save(obj, function(err, result) {
    if(err) return console.error(err);
    // Let's just hope it worked.
    // At least for now :)
    res.redirect('/');
  });
});