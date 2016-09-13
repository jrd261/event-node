'use strict';

const EventNode = require('../index.js');

let promise;
let resolve;
let reject;
let events;

beforeEach(() => {
  promise = new Promise((a, b) => { resolve = a; reject = b; });
  events = new EventNode();
});


it('Should be able to register', () => {
  events.on('hello', () => {});
});

it('Should respond to events.', () => {
  events.on('hi', resolve);
  events.trigger('hi');
  return promise;
});

it('Should pass multiple arguments to callback.', () => {
  events.on('test', (a, b, c, d) => {
    if (d === 4) resolve();
    else reject();
  });
  events.trigger('test', 1, 2, 3, 4);
  return promise;
});

it('Should cancel listeners.', () => {
  const listener = events.on('test', reject);
  listener.cancel();
  events.trigger('test').then(() => setTimeout(resolve, 100));
  return promise;
});

it('Should be cleared by global clear.', () => {
  events.on('hi', reject);
  events.clear();
  events.trigger('hi').then(() => setTimeout(resolve, 100));
  return promise;
});


it('Should be cleared by context clear.', () => {
  events.on('yo', reject, 'test');
  events.on('yo', () => setTimeout(resolve, 100));
  events.clear('test');
  events.trigger('yo');
  return promise;
});

it('Should succeed for multiple listeners.', () => {
  let n = 0;
  events.on('update', update => {
    n += update;
  }, 'context');
  events.on('update', update => {
    n += update;
  });
  events.trigger('update', 4);
  setTimeout(() => {
    if (n === 8) resolve();
    else reject(n);
  }, 500);
  return promise;
});

it('should clone payload', done => {
  let i = 0;
  function callback (payload) {
    if (payload.a) done(new Error());
    payload.a = true;
    i++;
    if (i === 2) done();
  }
  events.on('test', callback);
  events.on('test', callback);
  events.trigger('test', {});

});
