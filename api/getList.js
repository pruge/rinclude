'use strict';
var fs = require('fs-extended'),
  // _                 = require('lodash'),
  includes = require('lodash.includes'),

  generateIndexJs = require('./generateIndexJs'),
  getProperty = require('./getProperty');


// exclude index.js
function filter(itemPath, stat) {
  if (includes(itemPath, 'index.js')) {
    return false;
  }

  // if directory, check .generateIndex, then generate
  if (stat.isDirectory()) {
    if (getProperty(itemPath)) {
      var targets = fs.readFileSync(itemPath + '/.generateIndex').toString().split(',');
      generateIndexJs(itemPath, targets);
    }
  }

  return true;
}
var fsOptions = {
  recursive: 0,
  filter: filter
};

module.exports = function getList(path) {
  var fsOptions = {
    recursive: 0,
    filter: filter
  };

  // return files except index.js
  return fs.listAllSync(path, fsOptions);
};
