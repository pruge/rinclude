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
// find folder ('./a/b/c') from project root folder
// and search package file within it's sub folder.

// folder tree
/ root
  | - server.js
  | - lib
       | - router
       |    - index.js
       | - config
            = index.js


// /server.js
var rinclude = require('rinclude').path('./');
var config   = rinclude('config');


// /lib/router/index.js
var rinclude = require('rinclude');
var config   = rinclude('config');
```
