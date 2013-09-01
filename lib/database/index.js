var config = require('../../config').Config;

var pg = require('pg');
var db = module.exports = new pg.Client(config.database_url); // Using an ENV variable to remove credentials from git
db.connect();