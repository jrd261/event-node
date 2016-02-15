'use strict';

class Listener {

  constructor (id, namespace, callback, context) {
    this.id = id;
    this.namespace = namespace;
    this.callback = callback;
    this.context = context;
  }

  cancel () {
    return this.clear(null, true);
  }

  clear (context, prune) {
    if (context && context !== this.context) return;
    delete this.namespace.listeners[this.id];
    if (prune) { this.namespace.prune(); this.namespace.node.prune(); }
    delete this.id;
    delete this.namespace;
    delete this.callback;
    delete this.context;
  }

  trigger () {
    return this.callback.apply(null, arguments);
  }

}

module.exports = Listener;
