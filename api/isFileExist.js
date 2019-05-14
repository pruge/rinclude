const fs = require('fs'),
  nodePath = require('path'),
  isUndefined = require('lodash.isundefined');

module.exports = function getProperty(path, file = '.generateIndex') {
  let stat = undefined;
  let dest;
  try {
    if (/\.js/.test(path)) {
      dest = path;
    } else {
      dest = nodePath.resolve(path, file);
    }
    stat = fs.lstatSync(dest);
  } catch (e) {
    // return undefined;
  } finally {
    // return !isUndefined(stat);
    return stat;
  }
};
