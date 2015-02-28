rinclude
=======

require module with custome folder

install
```
npm install rinclude
```

usage
```
// option
if folder have ".generateIndex" file, then generate index.js

see example

var include = require('rinclude');

// set path.
// include.path( path, prefix );
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

```
