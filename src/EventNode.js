'use strict';

const Namespace = require('./Namespace');

const nodes = {};

class EventNode {

  constructor () {
    this.id = Math.random();
    this.namespaces = {};
  }

  static clear (context) {
    Object.keys(nodes).forEach(id => nodes[id].clear(context));
  }

  on (name, callback, context) {
    if (!this.namespaces[name]) this.namespaces[name] = new Namespace(name, this, callback, context);
    return this.namespaces[name].on(callback, context);
  }

  trigger () {
    if (!this.namespaces[arguments[0]]) return Promise.resolve([]);
    return this.namespaces[arguments[0]].trigger([].splice.call(arguments, 1));
  }

  getNamespace (name) {
    if (!this.namespaces[name]) this.namespaces[name] = new Namespace();
    return this.namespaces[name];
  }

  prune () {
    if (Object.keys(this.namespaces).length > 0) return;
    delete nodes[this.id];
  }

  clear (context) {
    Object.keys(this.namespaces).forEach(name => this.namespaces[name].clear(context, false));
    this.prune();
  }

}

module.exports = EventNode;