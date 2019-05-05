'use strict';
var fs = require('fs-extended'),
  nodePath = require('path'),
  // _           = require('lodash'),
  includes = require('lodash.includes'),
  isEmpty = require('lodash.isempty'),
  last = require('lodash.last'),
  isString = require('lodash.isstring'),
  forEach = require('lodash.forEach'),
  colors = require('colors'),

  getProperty = require('./getProperty');

module.exports = function generateIndexJs(path, targets) {
  var content = [],     // temp array
    files = {};       // lib : absolute directory

  targets.map(function (target) {
    var prefix;
    target = target.trim();
    if (includes(target, ':')) {
      var tmp = target.split(':');
      target = tmp[0].trim();
      prefix = tmp[1].trim();
    }

    var url = (!isEmpty(target)) ? path + '/' + target : path;
    // get list except index.js, !.js !directory
    var list;
    try {
      list = fs.listAllSync(url, {
        recursive: 0, filter: function (itemPath, stat) {
          // if ! .js or directory then pass
          if (nodePath.extname(itemPath) !== '.js' && !stat.isDirectory()) return false;

          // if directory, then generateIndex
          if (stat.isDirectory() && getProperty(itemPath)) {
            var targets = fs.readFileSync(itemPath + '/.generateIndex').toString().split(',');
            generateIndexJs(itemPath, targets);
          }

          // index.js pass
          if (includes(itemPath, 'index.js')) return false;

          return true;
        }
      });
    } catch (e) {
      if (e.errno === -2) {
        // console.log( '[rinclude] '.yellow + target.green + ' is not exist.' );
        // console.log( '[rinclude] '.yellow + 'check ' + '.generateIndex'.green);
        // console.log( '[rinclude] '.yellow + 'at '+path);
      } else {
        throw e;
      }
    } finally {
      list = list || [];
    }

    if (!isEmpty(prefix)) {
      files[prefix] = files[prefix] || {};
    }

    // get files object
    list.map(function (file) {

      if (!isEmpty(prefix)) {
        files[prefix][file] = (!isEmpty(target)) ? target + '/' + file : file;
      } else {
        // check duplicate in targets
        if (!isEmpty(files[file])) {
          console.log('[rinclude] '.yellow + 'duplicate file ' + file.green + ' between ' + [files[file], ', ', target, '/', file].join('').green);
          console.log('[rinclude] '.yellow + 'at ' + path.green);
          throw new Error('duplicate file [' + file + '], between ' + files[file] + ', ' + target + '/' + file);
        }
        files[file] = (!isEmpty(target)) ? target + '/' + file : file;
      }
    });
  });

  // console.log(files);

  // last = last( keys(files) );
  content = [];
  content.push('module.exports = {');
  print(3, files);
  content.push('};')
  content = content.join('\n');

  fs.writeFileSync(nodePath.resolve(path, 'index.js'), content);

  function print(offset, obj) {
    var lastItem = last(Object.keys(obj)); // last item of obj

    forEach(obj, function (file, key) {
      var name, str;
      name = nodePath.basename(key, '.js');

      if (!isString(file)) {
        content.push(Array(offset).join(' ') + name + ' : {');
        print(offset + 2, file);
        str = Array(offset).join(' ') + '}';
      } else {
        str = Array(offset).join(' ') + name + ' : require(\'./' + file + '\')'

      }
      str = (lastItem !== key) ? str + ', ' : str;
      content.push(str);
    });
  }
}
