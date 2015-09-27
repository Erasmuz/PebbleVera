/* jshint node:true *//* global define, escape, unescape */
'use strict';
/** Import Stuffs. */
var UI = require('ui');
var LightWindow = require('LightWindow');

/**
* Menu class for listing lights available for a user to control.
*/
var LightMenu = {};

/**
* Constructor for a scene menu.
*/
LightMenu.LightMenu = function() {
  /** Pebble menu object this class is wrapping. */
  this.menu = new UI.Menu();
  /** Count of items in the list. */
  this.itemCount = 0;

  /**
  * Adds an item to the light menu.
  * @param name - Name of the scene
  * @param id - ID of the scene
  */
  this.addItem = function(name, id) {
    this.menu.item(0, this.itemCount, { title: name, id: id });
    this.itemCount++;
  };

  /** 
  * Shows this menu.
  */ 
  this.show = function() {
    this.menu.show();
  };
  
  /**
  * Handler for a user selecting a light in the list.
  * Creates a new light window to show details about the light and allow
  * the user to control it.
  */
  this.menu.on('select', function(e) {
    var lightWindow = new LightWindow.LightWindow(e.item.id, e.item.title);
    lightWindow.show();
  });
};

/** Export javascript module for other files to use. */
if (typeof module != 'undefined' && module.exports) module.exports = LightMenu; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return LightMenu; }); // AMD