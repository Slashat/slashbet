var assert = require('chai').assert;
var helper = require('../../helper');
var sh = require('shorthash');
var bet = require('../models/bet');

describe('Bet', function(){

  var bet_object = {
    bet:  "Test text",
    color:  helper.ipToHex('127.0.0.1'),
    date: helper.yyyymmdd(new Date),
    hash: sh.unique("Test text")
  };

  before(function(done) {
    var db = require('../../database');
    db.query('DROP TABLE IF EXISTS bets', function(err, result) {
      if(err) throw err;
      db.query('DROP TABLE IF EXISTS votes', function(err, result) {
        if(err) throw err;
        db.query('CREATE TABLE bets (id serial NOT NULL, bet text, color character(6), date date, hash character varying(10), CONSTRAINT bets_key PRIMARY KEY (id) )', function(err, result) {
          if(err) throw err;
          db.query('CREATE TABLE votes (bet_id integer NOT NULL, ip character(15) NOT NULL, vote boolean NOT NULL, CONSTRAINT "votes_key" PRIMARY KEY (bet_id, ip, vote) )', function(err, result) {
            if(err) throw err;

            done();
          });
        });
      });
    });
  });

  describe('#save', function(done){
    it("should save a single bet", function(done) {

      bet.save(bet_object, function(err, result) {
        if(err) return console.error(err);
        assert.equal(result.command, 'INSERT');
        assert.equal(result.rowCount, 1);
        done();
      });

    });
  });

  describe('#getById', function(done){
    it("should return single bet", function(done) {

      bet.getById(1, function(err, result) {
        if(err) return console.error(err);

        assert.equal(result.command, 'SELECT');
        assert.equal(result.rowCount, 1);
        assert.equal(typeof result.rows[0], 'object');
        assert.equal(result.rows[0].bet, bet_object.bet);
        assert.equal(result.rows[0].color, bet_object.color);
        assert.equal(helper.yyyymmdd((result.rows[0].date), bet_object.date); // Broken dates
        assert.equal(result.rows[0].hash, bet_object.hash);

        done();
      });

    });
  });

})