
var express = require('express');
var app = module.exports = express();

app.set('views', __dirname + '/views');


var auth = require('../auth');
var sh = require('shorthash');
var pg = require('pg');


var db = new pg.Client(process.env.DATABASE_URL || "postgres://stenehall:@127.0.0.1/slashbet");
db.connect();


function ipTohex (ip) {
  var parts = ip.split('.');
  var hex = '';
  hex = hex + lpad(parseInt(parts[0]).toString(16), 2);
  hex = hex + lpad(parseInt(parts[1]).toString(16), 2);
  hex = hex + lpad(parseInt(parts[2]).toString(16), 2);
  return hex;
}

function lpad (str, length) {
  while (str.length < length)
      str = "0" + str;
  return str;
}

function getClientAddress(request){
    with(request)
        return (headers['x-forwarded-for'] || '').split(',')[0]
            || connection.remoteAddress
}


app.get('/', function index(req, res){

  console.log(req);

  db.query('SELECT bets.*, COUNT(CASE WHEN vote IS NOT NULL THEN 1 END) as votes FROM bets LEFT JOIN votes ON bets.id = votes.bet_id GROUP BY id ORDER BY votes DESC', function(err, result) {
    if(err) return console.error(err);

    res.render('index', { title: 'Slashbet', bets: result.rows, isAuthenticated: req.isAuthenticated() });
  });
});


app.get('/:id', function single(req, res){
  db.query('SELECT bets.*, COUNT(CASE WHEN vote = FALSE THEN 1 END) as no, COUNT(CASE WHEN vote = TRUE THEN 1 END) as yes FROM bets LEFT JOIN votes on bets.id = votes.bet_id WHERE bets.id = $1 GROUP BY bets.id', [req.params.id], function(err, result) {
    if(err) return console.error(err);

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

app.get('/:id/:vote', function vote(req, res){

  if(req.params.id === undefined || req.params.vote === undefined)
  {
    res.redirect('/');
  }

  var clientIP = getClientAddress(req);

  db.query('SELECT * FROM bets WHERE id = $1', [req.params.id], function(err, result) {
    if(err) return console.error(err);
    if(result.rows.length !== 1)
    {
      res.redirect('/');
    }
    else
    {
      var bet = result.rows[0];
      db.query('SELECT * FROM votes WHERE bet_id = $1 AND ip = $2', [bet.id, clientIP], function(err, result) {
        if(result.rows.length !== 0)
        {
          res.redirect('/'+req.params.id);
        } else {
          db.query('INSERT INTO votes(bet_id, ip, vote) values($1, $2, $3)', [bet.id, clientIP, req.params.vote], function(err, result) {
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

  var hash = sh.unique(req.body.bet);
  var clientIP = getClientAddress(req);
  var hex = ipTohex(clientIP);
  var date = req.body.date || new Date;

  db.query('INSERT INTO bets(bet, color, date, hash) values($1, $2, $3, $4)', [req.body.bet, hex, date, hash], function(err, result) {
    if(err) return console.error(err);
    // Let's just hope it worked.
    // At least for now :)
    res.redirect('/');
  });
});