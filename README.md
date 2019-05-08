# rinclude

require module with custom folder and generate virtual index.js automatically



## install
```
npm install rinclude
```

## Usage
Add the following to the startup file
```
const include = require('rinclude');
global.include = include; // It can be used anywhere.
```

## Notice
```
It no longer create an index.js file.
You do not need to exclude the index.js file from programs like pm2.
```

## Detailed usage
### basic
Add the following to the startup file
```
const include = require('rinclude');
global.include = include; // It can be used anywhere.
```

example
```
// Read files in custom folders
 .
 ├── custom
 │     └── timer
 │           ├── start.js
 │           ├── stop.js
 │           └── index.js
 ├── app.js
 └── sample.js
```

```
// app.js
const include = require('rinclude');
global.include = include; // It can be used anywhere.

include.path('./custom');

const timer = include('timer');
timer.start();
timer.stop();

require('.sample')
```

```
// smaple.js
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
```

```
include.path('./custom);
include.path('./custom2); // Crash
```

Use prefix
```

include.path('./custom');
include.path('./custom2', 'two');

const timer = include('timer');
const timer2 = include('two.timer');

timer.start();
timer.stop();

timer2.start();
timer2.stop();
```

### Automatically create an virtual index file
```
 .
 ├── custom
 │     └── timer
 │           ├── start.js
 │           └── stop.js
 └── app.js
```

```
include.path('./custom');
const timer = include('timer'); // The index.js file is required.
```

Add the .generateIndex file.
```
 .
 ├── custom
 │     └── timer
 │           ├── start.js
 │           ├── stop.js
 │           └── .generateIndex
 └── app.js
```

Automatically create virtual index.js file.

The contents of virtual index.js are as follows.
```
module.exports = {
  start : require('./start.js'),
  stop : require('./stop.js')
};
```

You can now access the timer.
```
include.path('./custom');
const timer = include('timer');

timer.start();
timer.stop();
```

When you add a file and restart app.js,
virtual index.js is created automatically

```
 .
 ├── custom
 │     └── timer
 │           ├── start.js
 │           ├── stop.js
 │           ├── pause.js       // add new file
 │           └── .generateIndex
 └── app.js
```

The contents of virtual index.js are as follows.

```
module.exports = {
  pause: require('./pause.js'),
  start : require('./start.js'),
  stop : require('./stop.js')
};
```

You can now access the timer.

```
include.path('./custom');
const timer = include('timer');

timer.start();
timer.stop();
timer.pause();
```

### Usage : .generateIndex
1. basic
 - Create only a .generateIndex file.
 - It lists all the files in the folder.
```
 .
 ├── custom
 │     └── timer
 │           ├── start.js
 │           ├── stop.js
 │           └── .generateIndex
 └── app.js
```

- Generated virtual index.js
```
module.exports = {
  start : require('./start.js'),
  stop : require('./stop.js')
};
```

2. You can have a special folder structure.

```
 .
 ├── custom
 │     └── timer
 │           ├── api
 │           │    ├── start.js
 │           │    └── stop.js
 │           ├── lcd
 │           │    └── display.js
 │           ├── info.js
 │           └── .generateIndex
 └── app.js
```
ex1)
- Contents of .gnerateIndex
```
api, lcd
```

- Generated virtual index.js
```
module.exports = {
  start : require('./api/start.js'),
  stop : require('./api/stop.js'),
  info : require('./info.js'),
  display: require('./lcd/display.js)
};
```

ex2)
- Contents of .gnerateIndex
```
api, lcd:lcd
```

- Generated virtual index.js
```
module.exports = {
  start : require('./api/start.js'),
  stop : require('./api/stop.js'),
  info : require('./info.js'),
  lcd: {
    display: require('./lcd/display.js)
  }
};
```

ex3)
- Contents of .gnerateIndex
```
api:api, lcd
```

- Generated virtual index.js
```
module.exports = {
  api : {
    start : require('./api/start.js'),
    stop : require('./api/stop.js')
  },
  info : require('./info.js'),
  display : require('./lcd/display.js')
};
```

3. Excludes undefined folders.
```
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
 │           ├── info.js
 │           └── .generateIndex
 └── app.js
```

- Contents of .gnerateIndex
```
api, lcd:lcd
```

- Generated virtual index.js
```
module.exports = {
  start : require('./api/start.js'),
  stop : require('./api/stop.js'),
  info : require('./info.js'),
  lcd: {
    display: require('./lcd/display.js)
  }
};
```

4. It supports several subfolders.
```
 .
 ├── custom
 │     └── timer
 │           ├── api
 │           │    ├── start.js
 │           │    └── stop.js
 │           ├── lcd
 │           │    ├── check
 │           │    │    └── checking.js
 │           │    └── display.js
 │           ├── info.js
 │           └── .generateIndex
 └── app.js
```

- Contents of .gnerateIndex
```
api, lcd:lcd
```

- Generated virtual index.js
```
module.exports = {
  start : require('./api/start.js'),
  stop : require('./api/stop.js'),
  info : require('./info.js'),
  lcd: {
    check: {
      checking: require('./lcd/check/checking.js')
    },
    display: require('./lcd/display.js)
  }
};
```
