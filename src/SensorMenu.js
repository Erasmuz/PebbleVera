/* jshint node:true *//* global define, escape, unescape */
'use strict';
/** Import Stuffs. */
var UI = require('ui');
var SensorWindow = require('SensorWindow');

/**
* Menu class for listing sensors available for a user to view.
*/
var SensorMenu = {};

/**
* Constructor for a sensor menu.
*/
SensorMenu.SensorMenu = function() {
  /** Pebble menu object this class is wrapping. */
  this.menu = new UI.Menu();
  /** Count of items in the list. */
  this.itemCount = 0;

  /**
  * Adds an item to the sensor menu.
  * @param name - Name of the sensor
  * @param id - ID of the sensor
  * @param category - Category for the sensor (required in order to know what key to use to find value)
  */
  this.addItem = function(name, id, category) {
    this.menu.item(0, this.itemCount, { title: name, id: id, category: category });
    this.itemCount++;
  };

  /** 
  * Shows this menu.
  */ 
  this.show = function() {
    this.menu.show();
  };
  
  /**
  * Handler for a user selecting a sensor in the list.
  * Creates a new sensor window to show details about the sensor
  */
  this.menu.on('select', function(e) {
    var sensorWindow = new SensorWindow.SensorWindow(e.item.id, e.item.title, e.item.category);
    sensorWindow.show();
  });
};

/** Export javascript module for other files to use. */
if (typeof module != 'undefined' && module.exports) module.exports = SensorMenu; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return SensorMenu; }); // AMD