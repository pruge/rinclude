
var nodePath    = require('path'),
    _           = require('lodash'),
    fs          = require('fs-extended'),

    scanResult  = {},
    libs        = [],
    folders     = [],
    root        = nodePath.resolve(__dirname, '../../');

function include ( lib ) {
  var path = scanResult[lib];

  console.log(scanResult);

  if ( _.isUndefined(path) ) {
    throw new Error('[' + lib + '] module not found in path [ ' + folders.join(', ') + ' ]');
  }

  return require( path );
}

include.path = function path ( folder, options ) {
  var self = this;

  // option.divider = folder or file, default is folder
  if ( !_.isObject(options) ) {
    options = {prefix: options, divider: 'folder'};
  } else {
    options.divider = options.divider || 'folder';
  }

  // folders = Array.prototype.slice.call(arguments);
  // folders.forEach(function (folder) {
  folders.push( folder );
    self.scan( folder, options );
  // });

  return this;
};


include.scan = function scan( folder, options ) {
  var base = nodePath.resolve( root, folder );
  function filter (itemPath, stat) {
    if (options.divider === 'file') {
      return stat.isFile();
    } else {
      // console.log(stat);
      return stat.isDirectory();
    }
  }
  var fsOptions = {
    recursive: 0,
    filter: filter
  };

  this.checkDuplicate( libs, fs.listAllSync( base, fsOptions ), base, options );
};

include.checkDuplicate = function checkDuplicate ( prevLibs, nowLibs, base, options ) {
  nowLibs.forEach(function (lib) {
    var key  = ( options.prefix !== undefined ) ? options.prefix+'.'+lib : lib;
    if ( _.includes( prevLibs, key) ) {
      throw new Error('[' + key + '] module is duplicate. check it.');
    }
  });

  this.generate( nowLibs, base, options );
  libs = prevLibs.concat( nowLibs );
};

include.generate = function generate ( nowLibs, base, options ) {
  nowLibs.forEach(function (lib) {
    var name = ( options.divider === 'file' ) ? nodePath.basename(lib, '.js') : lib;
    var key  = ( options.prefix !== undefined ) ? options.prefix+'.'+name : name;
    scanResult[key] = nodePath.resolve(base, lib);
  });
};

module.exports = include
