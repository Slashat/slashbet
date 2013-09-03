var User = function(){

  var _db = require('../../database');
  var helper = require('../../helper');

  var _setup = function _setup(callback) {
    _db.query('CREATE TABLE IF NOT EXISTS users (id serial NOT NULL, github_id character varying(50), username character varying(50), date_created date, date_last_signin date, CONSTRAINT user_key PRIMARY KEY (id) )', function(err, result) {
    });
  }

  // ### Get a single vote by id
  var _getByGithubId = function _getByGithubId(id, callback) {
    _db.query('SELECT * FROM users WHERE github_id = $1', [id], function(err, result) {

      if(err) throw err
      callback(err, result);
    });
  }


  // ### Save our bet
  var _createGithubUser = function createGithubUser(obj, callback) {
    _db.query('INSERT INTO users(github_id, username, date_created, date_last_signin) values($1, $2, $3, $4)', [obj.github_id, obj.username, helper.yyyymmdd(new Date), helper.yyyymmdd(new Date)], function(err, result) {
      if(err) throw err;
      callback(err, result);
    });
  }

  return {
    setup: _setup,
    getByGithubId : _getByGithubId,
    createGithubUser : _createGithubUser,
  }
}();
module.exports = User;