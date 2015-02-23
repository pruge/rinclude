
var nodePath    = require('path'),
    _           = require('lodash'),
    fs          = require('fs-extended'),

    scanResult  = [],
    root        = nodePath.resolve(__dirname, '../../'),
    base,
    relative;

function include ( lib ) {
  if (!_.include( scanResult, lib )) {
    throw new Error('[' + lib + '] module not found in path [ ' + relative + ' ]')
  }

  return require( nodePath.resolve(base, lib) );
}

include.path = function path ( path ) {
  relative = path;
  base = nodePath.resolve( root, path );

  // console.log( base );

  this.scan( base );
  return this;
};


include.scan = function scan( base ) {
  function filter (itemPath, stat) {
    return stat.isDirectory();
  }
  var options = {
    recursive: 0,
    filter: filter
  };
  scanResult = fs.listAllSync( base, options );
};

module.exports = include
