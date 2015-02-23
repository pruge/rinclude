rinclude
=======

require module with custome folder

install
```
npm install rinclude
```

usage
```
// path() execute only one, next run ignored.
// find folder ('my_modules','lib') from project root folder
// and search package file within it's sub folder.

// server.js
var rinclude = require('rinclude').path('my_modules','lib');
var config = rinclude('config');


// router.js
var rinclude = require('rinclude');
var config = rinclude('config');
```

custom module
```
It need to create 'package.json' like npm
'package.json' must have 'name', 'main' property
```