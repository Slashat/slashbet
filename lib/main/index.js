
var express = require('express');
var app = module.exports = express();

var auth = require('../auth');
var sh = require('shorthash');
var pg = require('pg');
var helper = require('../helper');
var Bet = require('./models/bet.js');
var Vote = require('./models/vote.js');
var config = require('../../config').Config;

app.set('views', __dirname + '/views');


// ## Show all bets ordered by votes
app.get('/', function action_index(req, res){
  var result = Bet.all(function(err, result) {

    var bets = [];
    result.rows.forEach(function(bet) {
      bet.date = (bet.date !== null) ? helper.yyyymmdd(bet.date) : null;
      bets.push(bet);
    });

    var bets_close_enddate = bets;
    bets_close_enddate.sort(function close_enddate(a,b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

    Bet.archived(function(err, result) {
      var archived = [];
      result.rows.forEach(function(bet) {
        bet.date = (bet.date !== null) ? helper.yyyymmdd(bet.date) : null;
        archived.push(bet);
      });

      res.render('index', {
        title: 'Slashbet',
        bets_most_points: bets,
        bets_close_enddate: bets_close_enddate,
        archived: archived,
        isAuthenticated: (req.isAuthenticated() && (config.auth.github.ids.indexOf(req.user.id) !== -1))
      });
    });


  });
});


// ## Show a single bet.json by id
app.get('/:id.json', function action_single(req, res){
  Bet.getById(req.params.id, function(err, result) {
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
      else
      {
        percent = 50;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(bet));
      res.end();
      return;
    }
  });
});


// ## Show a single bet by id
app.get('/:id', function action_single(req, res){
  Bet.getById(req.params.id, function(err, result) {
    if(result.rows.length !== 1)
    {
      res.redirect('/');
    }
    else
    {
      var bet = result.rows[0];
      var percent = 50;

      if (bet.yes != 0 || bet.no != 0)
      {
        console.log('doing it');
        yes = parseInt(bet.yes, 10);
        no = parseInt(bet.no, 10);
        percent = Math.round((yes / (yes+no))*100);
      }
      res.render('single', {title: bet.bet, bet: bet, percent: percent, color: bet.color, date: helper.yyyymmdd(bet.date) });
    }
  });
});


// ## Make your vote count!
app.get('/:id/:vote', function action_vote(req, res){

  if(req.params.id === undefined || req.params.vote === undefined)
  {
    res.redirect('/');
  }

  Bet.getById(req.params.id, function(err, result) {

    if(err) return console.error(err);
    if(result.rows.length !== 1)
    {
      res.redirect('/');
    }
    else
    {
      var bet = result.rows[0];
      var clientIP = helper.getClientAddress(req);

      Vote.getByIdIp(bet.id, clientIP, function(err, result) {
        if(result.rows.length !== 0)
        {
          res.redirect('/'+req.params.id);
        } else {

          var obj = {
            bet_id: bet.id,
            ip: clientIP,
            vote: req.params.vote,
            user_id : null
          };

          if (req.user !== undefined)
          {
            obj.user_id = req.user.user_id;
          }

          Vote.save(obj, function(err, result) {
            // Let's just hope it worked.
            // At least for now :)
            res.redirect('/'+req.params.id);
          });
        }
      });
    }
  });
});


// ## Post a new bet if you're authorized
app.post('/post', auth.ensureAuthenticated, function action_post(req, res) {

  var obj = {
    bet:  req.body.bet,
    color:  helper.ipToHex(helper.getClientAddress(req)),
    date: req.body.date || helper.yyyymmdd(new Date),
    hash: sh.unique(req.body.bet),
    user_id: req.user.user_id
  };

  Bet.save(obj, function(err, result) {
    if(err) return console.error(err);
    // Let's just hope it worked.
    // At least for now :)
    res.redirect('/');
  });
});