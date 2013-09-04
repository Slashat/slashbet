var Migration = function(){

  var _db = require('../lib/database');

  var _up = function _up(callback) {
    _db.query('ALTER TABLE migrations ALTER migration TYPE bigint', function(err, result) { });
  }


  return {
    up : _up,
  }
}();
module.exports = Migration;