# rinclude

require module with custom folder and generate index.js automatically



## install
```
npm install rinclude
```

## Usage
```
// Add the following to the startup file

const include = require('rinclude');
global.include = include; // It can be used anywhere.
```

## warning
```
When using programs such as pm2 and nodemon,
the index.js file must be excluded.
Otherwise, you will end up in an infinite loop.

ex) pm2
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    watch: ["server", "client"],
    watch_delay: 1000,
    ignore_watch : ["node_modules", "**/index.js"],  // ignore index.js
    watch_options: {
      "followSymlinks": false
    },
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```


## Detailed usage
### basic
```
// Add the following to the startup file

const include = require('rinclude');
global.include = include; // It can be used anywhere.


// Read files in custom folders
 .
 ├── custom
 │     └── timer
 │           ├── start.js
 │           ├── stop.js
 │           └── index.js
 └── app.js

 include.path('./custom');

// Access
const timer = include('timer');
timer.start();
timer.stop();
```

### Avoid collisions
```
 .
 ├── custom
 │     └── timer
 │           ├── start.js
 │           ├── stop.js
 │           └── index.js
 ├── custom2
 │     └── timer
 │           ├── start.js
 │           ├── stop.js
 │           └── index.js
 └── app.js

include.path('./custom);
include.path('./custom2); // Crash

// Use prefix

include.path('./custom');
include.path('./custom2', 'two');

const timer = include('timer');
const timer2 = include('two.timer');

timer.start();
timer.stop();

timer2.start();
timer2.stop();
```

### Automatically create an index file
```
 .
 ├── custom
 │     └── timer
 │           ├── start.js
 │           └── stop.js
 └── app.js

include.path('./custom');
const timer = include('timer'); // It do not have anything.
                                // The index.js file is required.

// Add the .generateIndex file.
 .
 ├── custom
 │     └── timer
 │           ├── start.js
 │           ├── stop.js
 │           └── .generateIndex
 └── app.js

// Automatically create index.js file.
 .
 ├── custom
 │     └── timer
 │           ├── start.js
 │           ├── stop.js
 │           ├── index.js
 │           └── .generateIndex
 └── app.js

// The contents of index.js are as follows.
// Generated index.js

module.exports = {
  start : require('./start.js'),
  stop : require('./stop.js')
};

// You can now access the timer.

include.path('./custom');
const timer = include('timer');

timer.start();
timer.stop();

// When you add a file and restart app.js,
// index.js is created automatically
 .
 ├── custom
 │     └── timer
 │           ├── start.js
 │           ├── stop.js
 │           ├── pause.js       // add new file
 │           ├── index.js
 │           └── .generateIndex
 └── app.js

// The contents of index.js are as follows.
// Generated index.js

module.exports = {
  pause: require('./pause.js'),
  start : require('./start.js'),
  stop : require('./stop.js')
};

// You can now access the timer.

include.path('./custom');
const timer = include('timer');

timer.start();
timer.stop();
timer.pause();

// Warning !!!!

When using programs such as pm2 and nodemon,
the index.js file must be excluded.
Otherwise, you will end up in an infinite loop.
```

### Usage : .generateIndex
```
1. basic
 - Create only a .generateIndex file.
 - It lists all the files in the folder.
 .
 ├── custom
 │     └── timer
 │           ├── start.js
 │           ├── stop.js
 │           ├── index.js
 │           └── .generateIndex
 └── app.js

// Generated index.js

module.exports = {
  start : require('./start.js'),
  stop : require('./stop.js')
};

2. You can have a special folder structure.
 .
 ├── custom
 │     └── timer
 │           ├── api
 │           │    ├── start.js
 │           │    └── stop.js
 │           ├── lcd
 │           │    └── display.js
 │           ├── index.js
 │           └── .generateIndex
 └── app.js

ex1)
// Contents of .gnerateIndex

api, lcd

// Generated index.js

module.exports = {
  start : require('./api/start.js'),
  stop : require('./api/stop.js'),
  display: require('./lcd/display.js)
};

ex2)
// Contents of .gnerateIndex

api, lcd:lcd

// Generated index.js

module.exports = {
  start : require('./api/start.js'),
  stop : require('./api/stop.js'),
  lcd: {
    display: require('./lcd/display.js)
  }
};

ex3)
// Contents of .gnerateIndex

api:api, lcd

// Generated index.js

module.exports = {
  api : {
    start : require('./api/start.js'),
    stop : require('./api/stop.js')
  },
  display : require('./lcd/display.js')
};


3. Excludes undefined folders.
 .
 ├── custom
 │     └── timer
 │           ├── api
 │           │    ├── start.js
 │           │    └── stop.js
 │           ├── lcd
 │           │    └── display.js
 │           ├── something
 │           │    └── notNeeded.js
 │           ├── index.js
 │           └── .generateIndex
 └── app.js

// Contents of .gnerateIndex

api, lcd:lcd

// Generated index.js

module.exports = {
  start : require('./start.js'),
  stop : require('./stop.js'),
  lcd: {
    display: require('./lcd/display.js)
  }
};

```
