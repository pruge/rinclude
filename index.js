
var nodePath    = require('path'),
    _           = require('lodash'),
    fs          = require('fs-extended'),

    scanResult  = {},
    libs        = [],
    folders     = [],
    root        = nodePath.resolve(__dirname, '../../');

function include ( lib ) {
  var path = scanResult[lib];

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

  function generateIndexJs (path, targets) {
    var json = {}, content = [], last;
    var files = {};

    targets.map(function (target) {
      target = target.trim();
      var url = (!_.isEmpty(target)) ? path+'/'+target : path;
      var list = fs.listAllSync( url , {recursive: 0, filter: function (itemPath, stat) {
        if ( nodePath.extname(itemPath) !== '.js' && !stat.isDirectory() ) return false;
        if ( _.includes(itemPath, 'index.js') ) return false;
        return true;
      }} );

      list.map(function (file) {
        if (!_.isEmpty(files[file])) {
          throw new Error('duplicate file [' + file + '], between ' + files[file] + ', ' + target+'/'+file);
        }
        files[file] = (!_.isEmpty(target)) ? target+'/'+file : file;
      });
      // files = files.concat(list);
    });

    // console.log(files);

    content.push('module.exports = {');

    last = _.last( _.keys(files) );
    _.forEach(files,  function (file, key) {
      var name = nodePath.basename(key, '.js');
      var str = '  '+name+' : require(\'./'+ file+ '\')'
      str = ( last !== key ) ? str + ', ' : str;
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
        var targets = fs.readFileSync(itemPath + '/.generateIndex').toString().split(',');
          // targets = _.compact(targets);
        // console.log(targets);
        generateIndexJs(itemPath, targets);
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
