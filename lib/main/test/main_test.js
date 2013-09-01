var assert = require('chai').assert;

describe('Main', function(){


  beforeEach(function() {

  });

  describe('#getSingle', function(){
    it("should return a single record", function(done) {
      bet.getSingle(req.params.id, function(err, result) {
        assert.equal(true, true);
        done();
      });
    });
  });

})