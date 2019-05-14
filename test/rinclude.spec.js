const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;
const include = require('../index.js');

// describe('rinclude load custom folder files', () => {
//   before(() => {
//     include.path('./custom');
//   });

//   it('should have timer', () => {
//     const timer = include('timer');
//     should.exist(timer);
//   });

//   it('should have stopwatch', () => {
//     const stopwatch = include('stopwatch');
//     should.exist(stopwatch);
//   });

//   it('should have something', () => {
//     function test() {
//       const something = include('something');
//     }
//     (test).should.throw();
//   });

//   it('should return message', () => {
//     const timer = include('timer');
//     timer.start().should.equal('custom.timer.start');
//     timer.stop().should.equal('custom.timer.stop');
//   });
// });

// describe('rincldue load custom2 folder files', () => {

//   it('should collision', () => {
//     expect(() => include.path('./custom2')).to.throw('[timer] module is duplicated. check it.');
//   });

//   it('should lcd.display()', () => {
//     include.path('./custom2', 'two');
//     include.path('./custom2', 'two');
//     const timer = include('two.timer');
//     timer.start().should.equal('custom2.timer.api.start');
//     timer.stop().should.equal('custom2.timer.api.stop');
//     timer.lcd.display().should.equal('custom2.timer.lcd.display');
//     timer.lcd.check.checking().should.equal('custom2.timer.lcd.check.checking');
//   })

// });

describe('rincldue create index.js', () => {

  it('should test()', () => {
    include.options({
      createIndex: true,
      type: 'es6'
    });
    include.clean();
    include.path('./custom3');
  })

});

