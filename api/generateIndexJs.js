'use strict';
var fs          = require('fs-extended'),
    nodePath    = require('path'),
    _           = require('lodash'),
    content     = [],   // temp array
    files;              // lib : absolute directory

module.exports = function generateIndexJs (path, targets) {
  files = {};

  targets.map(function (target) {
    var prefix;
    target = target.trim();
    if (_.includes(target, ':')) {
      var tmp = target.split(':');
      target = tmp[0].trim();
      prefix = tmp[1].trim();
    }

    var url = (!_.isEmpty(target)) ? path+'/'+target : path;
    // get list except index.js, !.js !directory
    var list = fs.listAllSync( url , {recursive: 0, filter: function (itemPath, stat) {
      // if ! .js or directory then pass
      if ( nodePath.extname(itemPath) !== '.js' && !stat.isDirectory() ) return false;
      // index.js pass
      if ( _.includes(itemPath, 'index.js') ) return false;
      return true;
    }} );

    // check duplicate in targets
    if (!_.isEmpty(prefix)) {
      files[prefix] = files[prefix] || {};
    }

    // get files object
    list.map(function (file) {
      if (!_.isEmpty(files[file])) {
        throw new Error('duplicate file [' + file + '], between ' + files[file] + ', ' + target+'/'+file);
      }

      if (!_.isEmpty(prefix)) {
        files[prefix][file] = (!_.isEmpty(target)) ? target+'/'+file : file;
      } else {
        files[file] = (!_.isEmpty(target)) ? target+'/'+file : file;
      }
    });
  });

  // console.log(files);

  // last = _.last( _.keys(files) );
  content = [];
  content.push('module.exports = {');
    print( 3, files );
  content.push('};')
  content = content.join('\n');

  fs.writeFileSync( nodePath.resolve(path, 'index.js'), content );
}

function print( offset, obj ) {
  var last = _.last( _.keys(obj) ); // last item of obj

  _.forEach(obj,  function (file, key) {
    var name, str;
    name = nodePath.basename(key, '.js');

    if ( !_.isString(file) ) {
      content.push(Array(offset).join(' ')+name+' : {');
      print( offset+2, file );
      str = Array(offset).join(' ')+'}';
    } else {
      str = Array(offset).join(' ')+name+' : require(\'./'+ file+ '\')'

    }
    str = ( last !== key ) ? str + ', ' : str;
    content.push( str );
  });
}
