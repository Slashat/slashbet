var db = require('../../database');
var fs = require('fs');

var setup = function setup(callback) {
  db.query('CREATE TABLE IF NOT EXISTS migrations (migration bigint, CONSTRAINT migration_key PRIMARY KEY (migration) )', function(err, result) {
  });
}

// ### Save our bet
var migrate = function migrate(obj, callback) {
  db.query('SELECT migration FROM migrations LIMIT 1', function(err, result) {

    var currentTimeStamp = (result.rowCount > 0) ? result.rows[0].migration : currentTimeStamp = 0;
    var files = fs.readdirSync('./migrations/')
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
    db.query('TRUNCATE TABLE migrations', function(err, result) {
      db.query('INSERT INTO migrations(migration) values($1)', [lastTimeStamp], function() {
        console.log('Migrations - All done');
      });
    });
  });
}

module.exports = {
    setup:     setup,
    migrate: migrate
};