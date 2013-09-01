var db = require('../../database');

// ### Get a single vote by id
var getSingle = exports.getSingle = function getSingle(id, callback) {
  db.query('SELECT bets.*, COUNT(CASE WHEN vote = FALSE THEN 1 END) as no, COUNT(CASE WHEN vote = TRUE THEN 1 END) as yes FROM bets LEFT JOIN votes on bets.id = votes.bet_id WHERE bets.id = $1 GROUP BY bets.id', [id], function(err, result) {
    if(err) throw err
    callback(err, result);
  });
}


// ### Get all bets ordered by votes
var all = exports.all = function all(callback) {
  db.query('SELECT bets.*, COUNT(CASE WHEN vote IS NOT NULL THEN 1 END) as votes FROM bets LEFT JOIN votes ON bets.id = votes.bet_id GROUP BY id ORDER BY votes DESC', function(err, result) {
    if(err) throw err
    callback(err, result);
  });
}

// ### Save our bet
var save = exports.save = function save(obj, callback) {
  db.query('INSERT INTO bets(bet, color, date, hash) values($1, $2, $3, $4)', [obj.bet, obj.hex, obj.date, obj.hash], function(err, result) {
    if(err) throw err;
    callback(err, result);
  });
}