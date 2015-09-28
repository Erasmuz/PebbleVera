/* jshint node:true *//* global define, escape, unescape */
'use strict';
/** Import Stuffs. */
var UI = require('ui');
var PowerWindow = require('PowerWindow');

/**
* Menu class for listing power meters available for a user to view.
*/
var PowerMenu = {};

/**
* Constructor for a poweer meter menu.
*/
PowerMenu.PowerMenu = function() {
  /** Pebble menu object this class is wrapping. */
  this.menu = new UI.Menu();
  /** Count of items in the list. */
  this.itemCount = 0;

  /**
  * Adds an item to the power meter menu.
  * @param name - Name of the meter
  * @param id - ID of the meter
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
  * Handler for a user selecting a meter in the list.
  * Creates a new meter window to show details about the meter
  */
  this.menu.on('select', function(e) {
    var powerWindow = new PowerWindow.PowerWindow(e.item.id, e.item.title);
    powerWindow.show();
  });
};

/** Export javascript module for other files to use. */
if (typeof module != 'undefined' && module.exports) module.exports = PowerMenu; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return PowerMenu; }); // AMD