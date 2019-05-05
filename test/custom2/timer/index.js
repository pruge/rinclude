module.exports = {
  api : {
    start : require('./api/start.js'), 
    stop : require('./api/stop.js')
  }, 
  display : require('./lcd/display.js')
};