var fs = require('fs'),
  nodePath = require('path'),
  isUndefined = require('lodash.isundefined');
// _           = require('lodash');

module.exports = function getProperty(path) {
  var stat = undefined;
  try {
    stat = fs.lstatSync(nodePath.resolve(path, '.generateIndex'));
  } catch (e) {

  } finally {
    return !isUndefined(stat);
  }
};
