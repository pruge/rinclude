var include = require('../');

include.path('./lib');
include.path('./app', 'app');

include('display').print();
include('show').print();

var timer = include('timer');
timer.start.print();
timer.pause.print();
timer.stop.print();

include('app.display').print();
include('app.show').print();

var appTimer = include('app.timer');
appTimer.start.print();
appTimer.pause.print();
appTimer.stop.print();
