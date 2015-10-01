/* jshint node:true *//* global define, escape, unescape */
'use strict';
/** Import stuffs */
var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

/**
* Menu class for listing scenes to a user to select.
*/
var SceneMenu = {};

/**
* Constructor for a scene menu.
*/
SceneMenu.SceneMenu = function() {
  /** PRIVATE: Pebble menu object this menu wraps. */
  this.menu = new UI.Menu();
  /** Count of items in the list. */
  this.itemCount = 0;
  
  /**
  * Adds an item to the scene menu.
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
  * Handler for a user selecting an item in the list
  */
  this.menu.on('select', function(e) {
    var url = Settings.option('url');
  
    ajax({
      url: url + "id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum=" + e.item.id,
      type: "GET",
      dataType: "json",
      headers: Settings.option('headers')
    },
      function(data) { console.log("Successfully ran scene."); },
      function(error) { console.log('Failed to run scene: ' + error); }
    );   
  });
  
  /**
  * Clears the menu.
  */
  this.clear = function() {
    this.menu.items(0, []);
    this.itemCount = 0;
  };
};

/** Exporting module for use in other files. */
if (typeof module != 'undefined' && module.exports) module.exports = SceneMenu; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return SceneMenu; }); // AMD