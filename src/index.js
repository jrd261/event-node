'use strict';

const nodes = {};

class Listener {

  constructor (callback, context, cancel) {
    this.callback = callback;
    this.context = context;
    this.cancel = cancel;
  }

}

class EventNode {

  constructor () {
    this._id = Math.random();
    this._listeners = {};
  }

  on (name, callback, context) {
    nodes[this._id] = this;
    const id = Math.random();
    if (!this._listeners[name]) this._listeners[name] = {};
    this._listeners[name][id] = new Listener(callback, context, () => this._cancelListener(name, id));
    return this._listeners[name][id];
  }

  trigger () {
    const args = [].splice.call(arguments, 0);
    if (!this._listeners[args[0]]) return Promise.resolve([]);
    return Promise.all(Object.keys(this._listeners[args[0]]).map(id => {
      let payload;
      try {
        payload = JSON.parse(JSON.stringify(args.slice(1)));
      } catch (error) {
        payload = args.slice(1);
      }
      this._listeners[args[0]][id].callback.apply(null, payload);
    }));
  }

  clear (context) {
    Object.keys(this._listeners).forEach(name => this._clearNamespace(name, context));
    this._pruneNode();
  }

  static clear (context) {
    Object.keys(nodes).forEach(id => nodes[id].clear(context));
  }

  get hasListeners () {
    return Object.keys(this._listeners).length > 0;
  }

  _clearNamespace (name, context) {
    Object.keys(this._listeners[name]).forEach(id => this._clearListener(name, id, context));
    this._pruneNamespace(name);
  }

  _clearListener (name, id, context) {
    if (context && this._listeners[name][id].context !== context) return;
    this._cleanListener(name, id);
  }

  _pruneNamespace (name) {
    if (Object.keys(this._listeners[name]).length === 0) delete this._listeners[name];
  }

  _pruneNode () {
    if (Object.keys(this._listeners).length === 0) delete nodes[this._id];
  }

  _cancelListener (name, id) {
    this._cleanListener(name, id);
    this._pruneNamespace(name);
    this._pruneNode();
  }

  _cleanListener (name, id) {
    delete this._listeners[name][id].callback;
    delete this._listeners[name][id].context;
    delete this._listeners[name][id].cancel;
    delete this._listeners[name][id];
  }

}

module.exports = EventNode;
