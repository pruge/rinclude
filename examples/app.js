var include = require('../');

include.path('./lib');
include.path('./app', 'app');


require('./anotherFile');
