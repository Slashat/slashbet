var db = require('../../database');

var setup = function setup(callback) {
  db.query('CREATE TABLE IF NOT EXISTS bets (id serial NOT NULL, bet text, color character(6), date date, hash character varying(10), CONSTRAINT bets_key PRIMARY KEY (id) )', function(err, result) {
  });
}

// ### Get a single vote by id
var getById = function getById(id, callback) {
  db.query('SELECT bets.*, users.username, users.id as user_id, COUNT(CASE WHEN vote = FALSE THEN 1 END) as no, COUNT(CASE WHEN vote = TRUE THEN 1 END) as yes FROM bets LEFT JOIN votes ON bets.id = votes.bet_id LEFT JOIN users ON bets.user_id = users.id WHERE bets.id = $1 GROUP BY bets.id, users.id', [id], function(err, result) {

    if(err) throw err
    callback(err, result);
  });
}


// ### Get all bets ordered by votes
var all = function all(callback) {
  db.query('SELECT bets.*, COUNT(CASE WHEN vote IS NOT NULL THEN 1 END) as votes, COUNT(CASE WHEN vote = true THEN 1 END) as yes, COUNT(CASE WHEN vote = false THEN 1 END) as no FROM bets LEFT JOIN votes ON bets.id = votes.bet_id WHERE date >= current_timestamp GROUP BY id ORDER BY votes DESC', [], function(err, result) {
    if(err) throw err
    callback(err, result);
  });
}

// ### Get all bets ordered by votes
var archived = function archived(callback) {
  db.query('SELECT bets.*, COUNT(CASE WHEN vote IS NOT NULL THEN 1 END)as votes, COUNT(CASE WHEN vote = true THEN 1 END) as yes, COUNT(CASE WHEN vote = false THEN 1 END) as no FROM bets LEFT JOIN votes ON bets.id = votes.bet_id WHERE date < current_timestamp GROUP BY id ORDER BY votes DESC', [], function(err, result) {
    if(err) throw err
    callback(err, result);
  });
}

// ### Save our bet
var save = function save(obj, callback) {
  db.query('INSERT INTO bets(bet, color, date, hash, user_id) values($1, $2, $3, $4, $5)', [obj.bet, obj.color, obj.date, obj.hash, obj.user_id], function(err, result) {
    if(err) throw err;
    callback(err, result);
  });
}

module.exports = {
  setup: setup,
  getById : getById,
  all : all,
  archived: archived,
  save : save,
}