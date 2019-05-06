const fs = require('fs'),
  nodePath = require('path'),
  isUndefined = require('lodash.isundefined');

module.exports = function getProperty(path, file = '.generateIndex') {
  let stat = undefined;
  try {
    stat = fs.lstatSync(nodePath.resolve(path, file));
  } catch (e) {

  } finally {
    return !isUndefined(stat);
  }
};
