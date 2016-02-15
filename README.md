# Packyderm

A small module that pulls common configuration files from npm or Bower packages, and gives them to you as an object.

Maybe you have a module called Awesome, and it references a config file at the root of your project called `awesome.json`. An Awesome-compatible project may also want to get information from dependent Awesome-compatible projects installed via npm or Bower.

## Installation

```bash
npm install packyderm --save
```

## Usage

```js
var packyderm = require('packyderm');

// Your config file can be JSON or YML
var AWESOME_CONFIG = 'awesome.json';

// Our library's wrapper function
function findAwesomeLibraries(libraries, cb) {
  var libraries = libraries.concat(['SELF']);

  packyderm(libraries, AWESOME_CONFIG, function(err, configs) {
    cb(configs);
  });
}
```

### `packyderm(libraries, configFile, cb)`

Looks for `libraries` inside `node_modules` and `bower_components` inside the current working directory, and pulls in files with the filename `configFile`.

- `libraries` (Array of Strings): names of packages to look for.
  - You can also add an item called `SELF`, which will look for a config file in the current working directory.
- `configFile` (String): filename of the config file. Can be `.json` or `.yml`.
- `cb(err, configs)` (Function): callback to run when processing is done.
  - `configs` is an object of packages found. Each key is a package name (or `SELF`), and the value is the config found.
