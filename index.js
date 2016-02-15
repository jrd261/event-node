'use strict';

const EventNode = require('./dist/event-node');

if (typeof window === 'object') window.EventNode = EventNode;

module.exports = EventNode;
