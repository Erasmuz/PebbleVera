/* jshint node:true *//* global define, escape, unescape */
'use strict';
/** Import stuffs */
var UI = require('ui');
var Settings = require('settings');
var Vector2 = require('vector2');
var ajax = require('ajax');

/**
* Camera window class. Window to show a screen capture from a camera.
*/
var CameraWindow = {};

/**
* Constructor for a Camera Window Class.
* @param id - ID for the camera this window will show a capture from.
* @param name - Name of the camera.
*/
CameraWindow.CameraWindow = function(id, name) {
  // Store a reference to 'this' for use in scope changes (will use this every where to prevent confusion).
  var self = this;
  
  /** ID for the camera this window will show the value for. */
  self.id = id;
  
  /** Image object to use on the screen. */
  // Method 1 (fail)
  //self.image = new UI.Image();
  //self.image.image("http://orig13.deviantart.net/b28b/f/2011/156/9/d/pikachu_avatar_or_icon_by_pheonixmaster1-d3i6as0.png#width:100");
  //self.window.add(self.image);
  
  // Method 2 (fail)
  //var camImage = new UI.Image({
  //  position: new Vector2(0, 0),
  //  size: new Vector2(144, 168),
  //  image: "http://www.photographe-sur-bordeaux.com/wp-content/themes/core/images/about_icon/linkedin.png"
  //});
  //self.window.add(camImage);
  
  /** Pebble window object this window is wrapping. */
  self.window = new UI.Card({
    fullscreen: true
  });
  
  /** 
  * Show this window.
  */
  self.show = function() {
    self.window.show();
  };
  
  /**
  * Fetch the current screen capture from a camera.
  * @param id - The id for the camera.
  */
  /*
  self.fetchValue = function(id) {
    var url = Settings.option('url') + "id=variableget&DeviceNum=" + id + "&serviceId=" + vals[0] + "&Variable=" + vals[1];
    
    ajax({
      url: url,
      type: "GET",
      dataType: "json",
      headers: Settings.option('headers')
    },
      function(data) { 
        console.log("Successfully got sensor data."); 
        self.window.body(data);
      },
      function(error) { console.log('Failed to get sensor data: ' + error); }
    );
  };
  
  self.window.on('click', 'select', function(e) {
    self.fetchValue(self.id, self.category);
  });
  
  self.fetchValue(self.id, self.category);
  */
};



/** Exporting module for use in other files. */
if (typeof module != 'undefined' && module.exports) module.exports = CameraWindow; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return CameraWindow; }); // AMD