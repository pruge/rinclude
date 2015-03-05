'use strict';
var fs          = require('fs-extended'),
    nodePath    = require('path'),
    _           = require('lodash'),
    colors      = require('colors'),

    getProperty = require('./getProperty');

module.exports = function generateIndexJs (path, targets) {
  var content = [],     // temp array
      files = {};       // lib : absolute directory

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
    var list;
    try {
      list = fs.listAllSync( url , {recursive: 0, filter: function (itemPath, stat) {
        // if ! .js or directory then pass
        if ( nodePath.extname(itemPath) !== '.js' && !stat.isDirectory() ) return false;

        // if directory, then generateIndex
        if (stat.isDirectory() && getProperty(itemPath)) {
          var targets = fs.readFileSync(itemPath + '/.generateIndex').toString().split(',');
          generateIndexJs(itemPath, targets);
        }

        // index.js pass
        if ( _.includes(itemPath, 'index.js') ) return false;

        return true;
      }} );
    } catch (e) {
      if (e.errno === -2 ) {
        // console.log( '[rinclude] '.yellow + target.green + ' is not exist.' );
        // console.log( '[rinclude] '.yellow + 'check ' + '.generateIndex'.green);
        // console.log( '[rinclude] '.yellow + 'at '+path);
      } else {
        throw e;
      }
    } finally {
      list = list || [];
    }

    if (!_.isEmpty(prefix)) {
      files[prefix] = files[prefix] || {};
    }

    // get files object
    list.map(function (file) {
      // check duplicate in targets
      if (!_.isEmpty(files[file])) {
        console.log('[rinclude] '.yellow + 'duplicate file '+file.green + ' between ' + [files[file], ', ', target, '/', file].join('').green );
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
}
