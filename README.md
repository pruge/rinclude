rinclude
=======

require module with custome folder

install
```
npm install rinclude
```

usage
```
var include = require('rinclude');

// set path.
// include.path( path, prefix );
include.path('./lib');
include.path('')

// option
if folder have ".generateInde" file, then generate index.js
see example

var include = require('rinclude');


include('display').print();
include('show').print();

var timer = include('timer');
timer.start.print();
timer.pause.print();
timer.stop.print();
```
