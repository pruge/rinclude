const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;
const include = require('../index.js');

describe('rinclude load custom folder files', () => {
  before(() => {
    include.path('./custom');
  });

  it('should have timer', () => {
    const timer = include('timer');
    console.log('timer', timer);
    should.exist({});
    // should.exist(timer);
  });

  it('should return message', () => {
    const timer = include('timer');
    timer.start().should.equal('custom.timer.start');
    timer.stop().should.equal('custom.timer.stop');
  });
});

describe('rincldue load custom2 folder files', () => {

  it('should collision', () => {
    expect(() => include.path('./custom2')).to.throw('[timer] module is duplicated. check it.');
  });

  it('should lcd.display()', () => {
    include.path('./custom2', 'two');
    const timer = include('two.timer');
    timer.start().should.equal('custom2.timer.start');
    timer.stop().should.equal('custom2.timer.stop');
    timer.lcd.display().should.equal('custom2.timer.lcd.display');
  })

});