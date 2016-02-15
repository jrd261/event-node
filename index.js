'use strict';

const EventNode = require('./src/EventNode');

if (typeof window === 'object') window.EventNode = EventNode;

module.exports = EventNode;
