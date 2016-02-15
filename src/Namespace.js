'use strict';

const Listener = require('./Listener');

class Namespace {

  constructor (name, node) {
    this.name = name;
    this.node = node;
    this.listeners = {};
  }

  trigger (args) {
    const listeners = Object.keys(this.listeners).map(id => this.listeners[id]);
    return Promise.all(listeners.map(listener => listener.trigger.apply(listener, args)));
  }

  on (callback, context) {
    const id = Math.random();
    this.listeners[id] = new Listener(id, this, callback, context);
    return this.listeners[id];
  }

  clear (context) {
    Object.keys(this.listeners).forEach(id => this.listeners[id].clear(context, false));
    if (Object.keys(this.listeners).length > 0) return;
    delete this.node.namespaces[this.name];
    delete this.name;
    delete this.node;
    delete this.listeners;
  }

  prune () {
    if (Object.keys(this.listeners) === 0) delete this.node.namespaces[this.name];
  }

}

module.exports = Namespace;