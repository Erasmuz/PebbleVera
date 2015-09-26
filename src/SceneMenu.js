/* jshint node:true *//* global define, escape, unescape */
'use strict';
var UI = require('ui');

var SceneMenu = {};

SceneMenu.menu = new UI.Menu();
SceneMenu.itemCount = 0;

SceneMenu.addItem = function(name, id) {
  SceneMenu.menu.item(0, SceneMenu.itemCount, { title: name, id: id });
  SceneMenu.itemCount++;
};


if (typeof module != 'undefined' && module.exports) module.exports = SceneMenu; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return SceneMenu; }); // AMD