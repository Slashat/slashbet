var Migration = function(){

  var _db = require('../../database');
  var _fs = require('fs');

  var _setup = function _setup(callback) {
    _db.query('CREATE TABLE IF NOT EXISTS migrations (migration bigint, CONSTRAINT migration_key PRIMARY KEY (migration) )', function(err, result) {
    });
  }

  // ### Save our bet
  var _migrate = function migrate(obj, callback) {
    _db.query('SELECT migration FROM migrations LIMIT 1', function(err, result) {
      if (result.rowCount > 0)
      {
        currentTimeStamp = result.rows[0].migration;
      }
      else
      {
        currentTimeStamp = 0;
      }
      var files = _fs.readdirSync('./migrations/')
      var timeStamp;
      files.forEach(function(file) {
        timeStamp = parseInt(file.slice(0, -3),10);
        if (timeStamp > currentTimeStamp)
        {
          console.log('Migrations - Running: '+timeStamp);
          migration = require('./../../../migrations/'+file);
          migration.up();
        }
      });

      var lastTimeStamp = parseInt(files.pop().slice(0, -3),10);
      _db.query('TRUNCATE TABLE migrations', function(err, result) {
        _db.query('INSERT INTO migrations(migration) values($1)', [lastTimeStamp], function() {
          console.log('Migrations - All done');
        });
      });
    });
  }

  return {
    setup: _setup,
    migrate : _migrate,
  }
}();
module.exports = Migration;