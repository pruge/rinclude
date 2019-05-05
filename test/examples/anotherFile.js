include('display').print();
include('show').print();

var timer = include('timer');
timer.start.print();
timer.pause.print();
timer.stop.print();

console.log();

include('app.display').print();
include('app.show').print();

var appTimer = include('app.timer');
appTimer.start.print();
appTimer.pause.print();
appTimer.stop.print();

console.log();

var timer2 = include('timer2');

timer2.start.print();
timer2.util.stop.print();
