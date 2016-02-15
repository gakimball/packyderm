var glob = require('glob');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

// Functions that parse an input string based on the extension of the file it came from
var parsers = {
  '.json': function(file) {
    return JSON.parse(file);
  },
  '.yml': function(file) {
    return yaml.safeLoad(file);
  }
}

/**
 * Searches for dependent Bower and npm packages for config files matching the given name.
 * @param {string|string[]} packages - Names of packages to search for config files.
 * @param {string} configFile - Name of the config file to search for.
 * @param {function} cb - Callback to run when all found config files are parsed.
 * @return {object} Object of config files from found projects.
 */
module.exports = function(packages, configFile, cb) {
  var globPaths = [];
  var configList = {};
  var parser = parsers[path.extname(configFile)];

  // The input package list can be a string or array of strings
  if (typeof packages === 'string') {
    packages = [packages];
  }
  else if (typeof packages !== 'object') {
    throw new Error('Packyderm: must pass a single package name or an array of package names.');
  }

  packages.map(function(name) {
    var configText;

    // "SELF" is a special package name that is loaded right from the CWD
    if (name === 'SELF') {
      try {
        var fileContents = fs.readFileSync(path.join(process.cwd(), configFile));
        configList[name] = parser(fileContents);
        return;
      }
      catch(e) {
        console.log('Packyderm: couldn\'t find a config file in the base project folder.');
      }
    }

    // Try to load the package from node_modules
    try {
      var fileContents = fs.readFileSync(path.join(process.cwd(), 'node_modules', name, configFile));
      configList[name] = parser(fileContents);
      return;
    }

    // Try to load the package from bower_components
    catch (e) {
      try {
        var fileContents = fs.readFileSync(path.join(process.cwd(), 'bower_components', name, configFile));
        configList[name] = parser(fileContents);
        return;
      }

      // Log to console if no npm or Bower package was found
      catch (e) {
        console.log('Packyderm: couldn\'t find an npm or Bower package with the name ' + name);
        return;
      }
    }
  });

  cb(null, configList);
}
