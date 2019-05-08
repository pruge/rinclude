'use strict';
const fs = require('fs-extended'),
  nodePath = require('path'),
  includes = require('lodash.includes'),
  isEmpty = require('lodash.isempty'),
  last = require('lodash.last'),
  isString = require('lodash.isstring'),
  forEach = require('lodash.foreach'),

  colors = require('colors'),

  getProperty = require('./getProperty');

/**
 * object 내용을 문자열화 한다.
 *
 * @param {*} offset
 * @param {*} obj
 */
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

/**
 * index.js 파일로 출력한다.
 *
 * @param {*} content
 */
function writeIndexJs(content) {
  // last = last( keys(files) );
  content = [];
  content.push('module.exports = {');
  print(3, files);
  content.push('};')
  content = content.join('\n');

  fs.writeFileSync(nodePath.resolve(path, 'index.js'), content);
}

/**
 * string dot notaion을 object화 한다.
 *
 * @param {oject} files
 * @param {string} path lib의 상대 경로
 * @param {string} file lib의 절대 경로 + filename
 * @param {string} target .generateIndex에서 정의한 target
 * @param {string} [prefix='']
 * @returns
 */
function toObject(files, path, file, root, target, prefix = '') {
  // console.log('before path', path)
  const tPath = path;
  path = nodePath.normalize(path.replace(`${target}/`, `${prefix}/`)).replace(/^\/|\/$/g, '');
  // console.log('after path', path)
  const arr = path.split('/');
  const length = arr.length;
  let idx = 0;

  arr.reduce((obj, i) => {
    if (++idx === length) {
      if (obj[i] !== undefined) {
        const existFile = obj[i].replace(root, '');
        const newFile = file.replace(root, '');

        console.log('[rinclude] '.yellow + 'duplicate file ' + newFile.green + ' between ' + existFile.green);
        throw new Error('duplicate file ' + newFile + ' between ' + existFile);
      }
      obj[i] = file;
    } else {
      obj[i] = obj[i] || {};
    }
    return obj[i];
  }, files)

  return files;
}

/**
 * tree 읽기
 *
 * @param {object} files
 * @param {string} path   listup 하기 위한 directory
 * @param {string} target
 * @param {string} prefix
 */
function listup(files, path, root, target = '', prefix = '', recursive = false) {

  try {
    fs.listAllSync(path, {
      recursive: recursive,
      filter: (itemPath, stat) => {
        if (/.js/.test(itemPath)) return true;
        return false;
      },
      map: (itemPath, stat) => {
        itemPath = itemPath.replace(path, '')
        const filename = nodePath.basename(itemPath, '.js');
        const dirname = nodePath.dirname(itemPath);
        const key = nodePath.join(target, dirname, filename).replace(/^\/|\/$/g, '');

        toObject(files, key, nodePath.join(path, itemPath), root, target, prefix)

        // console.log('itemPath', root);
        return itemPath;
      }
    })
  } catch (e) {
    console.error(e);
  }
}

function listupTargets(root, path, targets, files) {
  targets = targets.filter(Boolean);

  targets.map(target => {
    let prefix;
    target = target.trim();
    if (includes(target, ':')) {
      var tmp = target.split(':');
      target = tmp[0].trim();
      prefix = tmp[1].trim();
    }

    const url = (!isEmpty(target)) ? path + '/' + target : path;

    // .generateIndex 에 정의된 폴더 검색
    listup(files, url, root, target, prefix, true);
  })

  // lib root 폴더 listup
  listup(files, path, root)
}

module.exports = function generateIndexJs(root, path, targets) {
  let files = {};

  listupTargets(root, path, targets, files);

  // console.log('files', files);
  return files;
}
