
var nodePath    = require('path'),
    _           = require('lodash'),
    fs          = require('fs-extended'),

    scanResult  = {},
    libs        = [],
    folders     = [],
    root        = nodePath.resolve(__dirname, '../../');

function include ( lib ) {
  var path = scanResult[lib];

  // console.log(scanResult);

  if ( _.isUndefined(path) ) {
    throw new Error('[' + lib + '] module not found in path [ ' + folders.join(', ') + ' ]');
  }

  return require( path );
}

include.path = function path ( folder, prefix ) {
  var self = this;
  var depth = 0;

  folders.push( folder );
  self.scan( root, folder, prefix,  depth );

  return this;
};

include.scan = function scan( root, folder, prefix, depth ) {
  depth++;
  var self = this;
  var base = nodePath.resolve( root, folder );

  // console.log(root, hasIndexJs(root));
  if (depth !== 1 && hasIndexJs(root) ) {
    return true;
  }

  function hasIndexJs (path) {
    return _.includes( fs.listAllSync( path, {recursive: 0} ), 'index.js' );
  }

  function generateIndexJs (path) {
    var json = {}, content = [], last;
    var files = fs.listAllSync( path, {recursive: 0, filter: function (itemPath, stat) {
      if ( nodePath.extname(itemPath) !== '.js' && !stat.isDirectory() ) return false;
      if ( _.includes(itemPath, 'index.js') ) return false;
      return true;
    }} );

    content.push('module.exports = {');

    last = _.last(files);
    _.forEach(files,  function (file) {
      var name = nodePath.basename(file, '.js');
      var str = '  '+name+' : require(\'./'+ name+ '\')'
      str = ( last !== file ) ? str + ', ' : str;
      content.push( str );
    });

    content.push('};')
    content = content.join('\n');

    fs.writeFileSync( nodePath.resolve(path, 'index.js'), content );
  }

  function getProperty (path) {
    var stat = undefined;
    try {
      stat = fs.lstatSync( nodePath.resolve(path, '.generateIndex') );
    } catch (e) {

    } finally {
      return !_.isUndefined( stat );
    }

  }

  function filter (itemPath, stat) {
    if (!!~itemPath.indexOf('index.js')) {
      return false;
    }

    if (stat.isDirectory()) {
      if (getProperty(itemPath)) {
        generateIndexJs(itemPath);
      }
      return true;
    } else {
      return true;
    }
  }
  var fsOptions = {
    recursive: 0,
    filter: filter
  };

  this.checkDuplicate( libs, fs.listAllSync( base, fsOptions ), base, prefix );

  if (depth !== 1 && !hasIndexJs(root)) {
    return false;
  }
};

include.checkDuplicate = function checkDuplicate ( prevLibs, nowLibs, base, prefix ) {
  nowLibs.forEach(function (lib) {
    var key  = ( prefix !== undefined ) ? prefix+'.'+lib : lib;
    if ( _.includes( prevLibs, key) ) {
      throw new Error('[' + key + '] module is duplicate. check it.');
    }
  });

  this.generate( nowLibs, base, prefix );
  libs = prevLibs.concat( nowLibs );
};

include.generate = function generate ( nowLibs, base, prefix ) {
  nowLibs.forEach(function (lib) {
    var name = nodePath.basename(lib, '.js');
    var key  = ( prefix !== undefined ) ? prefix+'.'+name : name;
    scanResult[key] = nodePath.resolve(base, lib);
  });
};

module.exports = include
