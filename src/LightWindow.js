/* jshint node:true *//* global define, escape, unescape */
'use strict';
/** Import stuffs */
var UI = require('ui');
var Settings = require('settings');
var ajax = require('ajax');

/**
* Light window class. Window representation of a light source.
*  gives the user the ability to turn on/off light sources.
*/
var LightWindow = {};

/**
* Constructor for a Light Window Class.
* @param id - ID for the light this window represents.
* @param name - Name of the light.
* @param category - The category for the light (optional, defaults to binary light)
* @param subcategory - The subcategory for the light (optional, defaults to 0)
* For details on categry see: http://wiki.micasaverde.com/index.php/Luup_UPNP_Files
*/
LightWindow.LightWindow = function(id, name, category, subcategory) {
  //Set defaults for category and subcategory.  For future dev.
  this.category = typeof category !== 'undefined' ? category : 3;
  this.subcategory = typeof subcategory !== 'undefined' ? subcategory : 0;
    
  /** ID for the light this window will control. */
  this.id = id;
  
  /** Pebble window object this window is wrapping. */
  this.window = new UI.Card({
    fullscreen: true,
    title: name,
    action: {
      up: 'images/light_on.png',
      down: 'images/light_off.png',
      background: 'black'
    }
  });

  /** 
  * Show this window.
  */
  this.show = function() {
    this.window.show();
  };
  
  /**
  * Handler for a user selecting the up button on the watch.
  */
  this.window.on('click', 'up', function() {
    LightWindow.toggleLight(id, 1);   
  });
  
  /**
  * Handler for a user selecting the down button on the watch.
  */
  this.window.on('click', 'down', function() {
    LightWindow.toggleLight(id, 0); 
  });
};

/**
* Sets a light to on/off
* @param id - The id for the light to turn on/off
* @param value - on/off
*      0 = Off
*      1 = On
*/
LightWindow.toggleLight = function(id, value) {
  ajax({
    url: Settings.option('url') + "id=action&output_format=xml&DeviceNum=" + id + "&serviceId=urn:upnp-org:serviceId:SwitchPower1&action=SetTarget&newTargetValue=" + value,
    type: "GET",
    dataType: "json",
    headers: Settings.option('headers')
  },
    function(data) { console.log("Successfully ran scene."); },
    function(error) { console.log('Failed to run scene: ' + error); }
  );
};

/** Exporting module for use in other files. */
if (typeof module != 'undefined' && module.exports) module.exports = LightWindow; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return LightWindow; }); // AMD