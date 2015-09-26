/* jshint node:true *//* global define, escape, unescape */
'use strict';
var UI = require('ui');

var LightMenu = {};

LightMenu.menu = new UI.Menu();
LightMenu.itemCount = 0;

LightMenu.addItem = function(name, id) {
  LightMenu.menu.item(0, LightMenu.itemCount, { title: name, id: id });
  LightMenu.itemCount++;
};


if (typeof module != 'undefined' && module.exports) module.exports = LightMenu; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return LightMenu; }); // AMD