var fs          = require('fs'),
    nodePath    = require('path'),
    _           = require('lodash');
    
module.exports = function getProperty (path) {
  var stat = undefined;
  try {
    stat = fs.lstatSync( nodePath.resolve(path, '.generateIndex') );
  } catch (e) {

  } finally {
    return !_.isUndefined( stat );
  }
};
