'use strict';

const EventNode = require('./EventNode');

if (typeof window === 'object') window.EventNode = EventNode;

module.exports = EventNode;
