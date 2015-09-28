/* jshint node:true *//* global define, escape, unescape */
'use strict';
/** Import stuffs */
var UI = require('ui');
var Settings = require('settings');
var Vector2 = require('vector2');
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
  // Store a reference to 'this' for use in scope changes (will use this every where to prevent confusion).
  var self = this;
  
  //Set defaults for category and subcategory.  For future dev.
  self.category = typeof category !== 'undefined' ? category : 3;
  self.subcategory = typeof subcategory !== 'undefined' ? subcategory : 0;
    
  /** ID for the light this window will control. */
  self.id = id;
  /** Position tracking for the slider. */
  self.sliderPos = 10;
  
  
  /** Pebble window object this window is wrapping. */
  self.window = new UI.Window({
    fullscreen: true,
    action: {
      up: 'images/light_on.png',
      down: 'images/light_off.png',
      select: 'images/refresh.png',
      background: 'black'
    }
  });
  
  //Make the window white
  self.window.add(new UI.Rect({ size: new Vector2(144, 168) }));

  self.window.add(new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(120, 30),
    font: 'gothic-28-bold',
    text: name,
    textOverflow: 'wrap',
    color: 'black',
    textAlign: 'left'
  }));
  
  self.window.add(new UI.Rect({
    position: new Vector2(10,150),
    size: new Vector2(80, 3),
    borderColor: 'black',
  }));
  
  self.slider = new UI.Circle({
    position: new Vector2(10, 150),
    radius:8,
    borderColor: 'black'
  });
  self.window.add(self.slider);
  
  /** 
  * Show this window.
  */
  self.show = function() {
    self.window.show();
  };
  
  /**
  * Handler for a user selecting the up button on the watch.
  */
  self.window.on('click', 'up', function() {
    if (self.category == 2) {
      //Update slider position
      if (self.sliderPos < 90) {
        self.sliderPos += 10;
      }
      
      LightWindow.setLightLevel(self.id, self.sliderPos - 10);
      
    } else if (self.category == 3) {
      self.sliderPos = 90;
      LightWindow.toggleLight(id, 1);   
    }
    
    self.slider.position(new Vector2(self.sliderPos, 150));
  });
  
  /**
  * Handler for a user selecting the down button on the watch.
  */
  self.window.on('click', 'down', function() {
    if (self.category == 2) {
      //Update slider position
      if (self.sliderPos > 10) {
        self.sliderPos -= 10;
      }
      
      LightWindow.setLightLevel(self.id, self.sliderPos - 10);
      
    } else if (self.category == 3) {
      self.sliderPos = 10;
      LightWindow.toggleLight(id, 0);   
    }
    
    self.slider.position(new Vector2(self.sliderPos, 150));
  });
  
  self.window.on('longClick', 'up', function() {
    self.sliderPos = 90;
    self.slider.position(new Vector2(self.sliderPos, 150));
    LightWindow.toggleLight(id, 1);   
  });
  
  self.window.on('longClick', 'down', function() {
    self.sliderPos = 10;
    self.slider.position(new Vector2(self.sliderPos, 150));
    LightWindow.toggleLight(id, 0);   
  });
};

/**
* Sets the value for a dimmable light
* @param id - The id for the light to set the value for
* @param value - 0-100 for the level to set the dimmable light to
*/
LightWindow.setLightLevel = function(id, value) {
  ajax({
    url: Settings.option('url') + "id=action&output_format=json&DeviceNum=" + id + "&serviceId=urn:upnp-org:serviceId:Dimming1&action=SetLoadLevelTarget&newLoadlevelTarget=" + value,
    type: "GET",
    dataType: "json",
    headers: Settings.option('headers')
  },
    function(data) { console.log("Successfully ran scene."); },
    function(error) { console.log('Failed to run scene: ' + error); }
  );
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