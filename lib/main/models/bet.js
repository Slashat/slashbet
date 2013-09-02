var Bet = function(){

  var _db = require('../../database');

  // ### Get a single vote by id
  var _getById = function _getById(id, callback) {
    _db.query('SELECT bets.*, COUNT(CASE WHEN vote = FALSE THEN 1 END) as no, COUNT(CASE WHEN vote = TRUE THEN 1 END) as yes FROM bets LEFT JOIN votes on bets.id = votes.bet_id WHERE bets.id = $1 GROUP BY bets.id', [id], function(err, result) {

      if(err) throw err
      callback(err, result);
    });
  }


  // ### Get all bets ordered by votes
  var _all = function all(callback) {
    _db.query('SELECT bets.*, COUNT(CASE WHEN vote IS NOT NULL THEN 1 END) as votes FROM bets LEFT JOIN votes ON bets.id = votes.bet_id GROUP BY id ORDER BY votes DESC', [], function(err, result) {
      if(err) throw err
      callback(err, result);
    });
  }

  // ### Save our bet
  var _save = function save(obj, callback) {
    _db.query('INSERT INTO bets(bet, color, date, hash) values($1, $2, $3, $4)', [obj.bet, obj.color, obj.date, obj.hash], function(err, result) {
      if(err) throw err;
      callback(err, result);
    });
  }

  return {
    getById : _getById,
    all : _all,
    save : _save,
  }
}();
module.exports = Bet;