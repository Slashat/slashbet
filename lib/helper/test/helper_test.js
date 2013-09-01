var assert = require('chai').assert;
var helper = require('../../helper');

describe('Helper', function(){

  beforeEach(function() { });

  describe('#lpad', function(){
    it("should return 01", function(done) {
      var result = helper.lpad("1", 2);
      assert.equal(result, "01");

      done();
    });

    it("should return 10", function(done) {
      var result = helper.lpad("10", 2);
      assert.equal(result, "10");

      done();
    });

    it("should still return 010 even with less padding", function(done) {
      var result = helper.lpad("010", 2);
      assert.equal(result, "010");

      done();
    });

    it("should return 0110", function(done) {
      var result = helper.lpad("110", 4);
      assert.equal(result, "0110");

      done();
    });
  });


  describe('#ipToHex', function(){
    it("ipToHex", function(done) {
      var result = helper.ipToHex("10.10.10.10");
      assert.equal(result, "0a0a0a");

      done();
    });

    it("", function(done) {
      var result = helper.ipToHex("100.100.100");
      assert.equal(result, "646464");

      done();
    });
  });

  describe('#getClientAddress', function() {
    it("should return the correct ip, not being tested atm");
  });
});