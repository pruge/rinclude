var include = require('../../');
global.include = include;

include.path('./lib');
include.path('./app', 'app');

// include('test');

require('./anotherFile');
