'use strict';
const fs = require('fs-extended'),
  includes = require('lodash.includes'),

  generateIndexJs = require('./generateIndexJs'),
  getProperty = require('./getProperty');

let base;

// exclude index.js
function filter(itemPath, stat) {
  if (includes(itemPath, 'index.js')) {
    return false;
  }

  // if directory, check .generateIndex, then generate
  if (stat.isDirectory()) {
    if (getProperty(itemPath)) {
      const targets = fs.readFileSync(itemPath + '/.generateIndex').toString().split(',');
      generateIndexJs(itemPath, targets);
    } else {

    }
  }

  return true;
}

function filter2(itemPath, stat) {
  if (includes(itemPath, 'index.js')) {
    return false;
  }

  return true;
}



let fsOptions = {
  recursive: 0,
  filter: filter
};

/**
 * generate
 *   - true  : Generate index.js after checking .generateIndex
 *   - false : Folder list only
 */
module.exports = function getList(path, generate) {
  if (!generate) {
    fsOptions.filter = filter2;
  }
  // return files except index.js
  return fs.listAllSync(path, fsOptions);
};
