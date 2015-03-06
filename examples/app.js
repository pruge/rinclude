var include = require('../');

include.path('./lib');
include.path('./app', 'app');

include('test');

require('./anotherFile');
