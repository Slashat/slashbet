var Migration = function(){

  var _db = require('../lib/database');

  var _up = function _up(callback) {
    _db.query('ALTER TABLE users ADD facebook_id integer', function(err, result) {});
  }


  return {
    up : _up,
  }
}();
module.exports = Migration;