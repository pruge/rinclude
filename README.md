rinclude
=======

require module with custom folder

install
```
npm install rinclude
```

usage
```
// option
// if folder have ".generateIndex" file
// then auto generate index.js
```

# see example

- app.js
```
var include = require('rinclude');

// set path.
// include.path( path, [prefix] );
include.path('./lib');
include.path('./app', 'app');
```

- anotherFile.js
```
var include = require('rinclude');

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


// .generateIndex
// api, lib:util
var timer2 = include('timer2');

timer2.start.print();
timer2.util.stop.print();
```
