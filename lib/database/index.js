var DB = function(){
  var config = require('../../config').Config;
  var _pg = require('pg');

  // ### Simple Database layer to connect to the postgres pool.
  var _query = function query(query, prepared, callback) {

    if (callback === undefined) // Really nasty solution. Needs to be fixed.
    {
      callback = prepared;
      prepared = [];
    }


    _pg.connect(config.database_url, function(err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }

      client.query(query, prepared, function(err, result) {
        done();

        if (err) {
          return console.error('error running query: '+query, err);
        }
        callback(err, result);
      });
    });
  }

  return {
    query : _query,
  }
}();
module.exports = DB;