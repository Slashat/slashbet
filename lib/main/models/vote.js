var db = require('../../database');

// ### Get a single vote based on client ip and bet
var get = exports.get = function get(id, ip, callback) {
  db.query('SELECT * FROM votes WHERE bet_id = $1 AND ip = $2', [id, ip], function(err, result) {
    if(err) throw err
    callback(err, result);
  });
}

// ### Save a vote
var save = exports.save = function save(obj, callback) {
  db.query('INSERT INTO votes(bet_id, ip, vote) values($1, $2, $3)', [obj.bet_id, obj.ip, obj.vote], function(err, result) {
    if(err) throw err
    callback(err, result);
  });
}