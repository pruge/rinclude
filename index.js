'use strict';
var nodePath = require('path'),
  // _           = require('lodash'),
  isUndefined = require('lodash.isundefined'),
  includes = require('lodash.includes'),
  fs = require('fs-extended'),
  callsite = require('callsite'),
  colors = require('colors'),

  getList = require('./api/getList'),

  scanResult = {},     // lib : absolute path
  libs = [],     // keys of scanResult
  folders = [],     // scanned folder
  root;

function include(lib) {
  var path = scanResult[lib];

  if (isUndefined(path)) {
    // absolute directory of caller
    var stack = callsite(),
      requester = stack[1].getFileName();
    var callerPath = nodePath.dirname(requester);

    console.log('[rinclude] '.yellow + lib.green + ' module not found in path [ ' + folders.join(', ').green + ' ]');
    console.log('[rinclude] '.yellow + 'in ' + requester.green);
    throw new Error('[' + lib + '] module not found in path [ ' + folders.join(', ') + ' ]');
  }

  return require(path);
}

function getCallerDirectory() {
}

include.path = function path(folder, prefix) {
  var self = this,

    // absolute directory of caller
    stack = callsite(),
    requester = stack[1].getFileName();
  root = nodePath.dirname(requester);

  // add folder
  folders.push(folder);

  // start scan
  self.scan(root, folder, prefix);

  return this;
};

include.scan = function scan(root, folder, prefix) {
  var self = this;
  var base = nodePath.resolve(root, folder);
  var newLibs = getList(base);

  this.checkDuplicate(libs, newLibs, base, prefix);
  this.generate(newLibs, base, prefix);
};

include.checkDuplicate = function checkDuplicate(prevLibs, newLibs, base, prefix) {
  newLibs.forEach(function (lib) {
    var key = (prefix !== undefined) ? prefix + '.' + lib : lib;
    if (includes(prevLibs, key)) {
      console.log('[rinclude] '.yellow + key.green + ' module is duplicated. check it.');
      console.log('[rinclude] '.yellow + 'in directory ' + folders.join(', ').green);
      console.log('[rinclude] '.yellow + 'rename or use prefix.');
      throw new Error('[' + key + '] module is duplicated. check it.');
    }
  });
  libs = prevLibs.concat(newLibs);
};

include.generate = function generate(newLibs, base, prefix) {
  newLibs.forEach(function (lib) {
    var name = nodePath.basename(lib, '.js');
    var key = (prefix !== undefined) ? prefix + '.' + name : name;
    scanResult[key] = nodePath.resolve(base, lib);
  });
};

module.exports = include
