module.exports = {
  start : require('./api/start.js'), 
  stop : require('./api/stop.js'), 
  lcd : {
    display : require('./lcd/display.js')
  }
};