var Vote = function(){

  var _db = require('../../database');

  var _setup = function _setup(callback) {
    _db.query('CREATE TABLE IF NOT EXISTS votes (bet_id integer NOT NULL, ip character(15) NOT NULL, vote boolean NOT NULL, CONSTRAINT "votes_key" PRIMARY KEY (bet_id, ip, vote) )', function(err, result) {
    });
  }

  // ### Get a single vote based on client ip and bet
  var _getByIdIp = exports.get = function get(id, ip, callback) {
    _db.query('SELECT * FROM votes WHERE bet_id = $1 AND ip = $2', [id, ip], function(err, result) {
      if(err) throw err
      callback(err, result);
    });
  }

  // ### Save a vote
  var _save = function save(obj, callback) {
    _db.query('INSERT INTO votes(bet_id, ip, vote, user_id) values($1, $2, $3, $4)', [obj.bet_id, obj.ip, obj.vote, obj.user_id], function(err, result) {
      if(err) throw err
      callback(err, result);
    });
  }

  return {
    setup: _setup,
    getByIdIp : _getByIdIp,
    save : _save,
  }
}();
module.exports = Vote;