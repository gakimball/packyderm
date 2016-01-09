var assert = require('assert');
var packy  = require('..');

describe('Packyderm', function() {
  before(function(done) {
    process.chdir('test/fixtures');
    done();
  });

  it('consumes config files from dependent packages', function(done) {
    packy(['package-a', 'package-b'], 'config.yml', function(err, packages) {
      assert.equal(Object.keys(packages).length, 2, 'one item for each package found');
      done();
    });
  });
});
