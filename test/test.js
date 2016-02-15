var expect = require('chai').expect;
var packy  = require('..');

describe('Packyderm', function() {
  before(function(done) {
    process.chdir('test/fixtures');
    done();
  });

  it('consumes config files from dependent packages', function(done) {
    packy(['package-a', 'package-b'], 'config.yml', function(err, packages) {
      expect(packages).to.have.all.keys('package-a', 'package-b');
      done();
    });
  });
});
