/* jshint node:true *//* global define, escape, unescape */
'use strict';
/** Import Stuffs. */
var UI = require('ui');
var CameraWindow = require('CameraWindow');

/**
* Menu class for listing cameras available for a user to view.
*/
var CameraMenu = {};

/**
* Constructor for a camera menu.
*/
CameraMenu.CameraMenu = function() {
  /** Pebble menu object this class is wrapping. */
  this.menu = new UI.Menu();
  /** Count of items in the list. */
  this.itemCount = 0;

  /**
  * Adds an item to the camera menu.
  * @param name - Name of the camera
  * @param id - ID of the camera
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
  * Handler for a user selecting a camera in the list.
  * Creates a new camera window to show an image from the camera
  */
  this.menu.on('select', function(e) {
    var cameraWindow = new CameraWindow.CameraWindow(e.item.id, e.item.title);
    cameraWindow.show();
  });
  
  /**
  * Clears the menu.
  */
  this.clear = function() {
    this.menu.items(0, []);
    this.itemCount = 0;
  };
};

/** Export javascript module for other files to use. */
if (typeof module != 'undefined' && module.exports) module.exports = CameraMenu; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return CameraMenu; }); // AMD