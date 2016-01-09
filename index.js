var async = require('asyncawait/async');
var await = require('asyncawait/await');
var glob = require('glob');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

var parsers = {
  '.json': function(file) {
    return JSON.parse(file);
  },
  '.yml': function(file) {
    return yaml.safeLoad(file);
  }
}

module.exports = function(packages, configFile, cb) {
  var globPaths = [];
  var configList = {};
  var parser = parsers[path.extname(configFile)];

  if (typeof packages === 'string') {
    packages = [packages];
  }
  else if (typeof packages !== 'object') {
    throw new Error('Packyderm: must pass a single package name or an array of package names.');
  }

  packages.map(function(name) {
    var configText;

    try {
      var fileContents = fs.readFileSync(path.join(process.cwd(), 'node_modules', name, configFile));
      configList[name] = parser(fileContents);
      return;
    }

    catch (e) {
      try {
        var fileContents = fs.readFileSync(path.join(process.cwd(), 'bower_components', name, configFile));
        configList[name] = parser(fileContents);
        return;
      }

      catch (e) {
        console.log('Packyderm: couldn\'t find an npm or Bower package with the name ' + name);
        return;
      }
    }
  });

  cb(null, configList);
}
