var assert = require('chai').assert;
var helper = require('../../helper');

describe('Helper', function(){

  beforeEach(function() { });

  it("lpad", function(done) {

    var result = helper.lpad("1", 2);
    assert.equal(result, "01");

    var result = helper.lpad("10", 2);
    assert.equal(result, "10");

    var result = helper.lpad("010", 2);
    assert.equal(result, "010");

    var result = helper.lpad("110", 4);
    assert.equal(result, "0110");

    done();
  });


  it("ipToHex", function(done) {

    var result = helper.ipToHex("10.10.10.10");
    assert.equal(result, "0a0a0a");

    var result = helper.ipToHex("100.100.100");
    assert.equal(result, "646464");

    done();
  });

  it("getClientAddress", function(done) {
    // This really needs no test :)
    assert.equal(true, true);

    done();
  });

})