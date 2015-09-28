/* jshint node:true *//* global define, escape, unescape */
'use strict';
/** Import stuffs */
var UI = require('ui');
var Settings = require('settings');
var ajax = require('ajax');

/**
* Power window class. Window representation of a power meter.
*  Gives the user the ability to get current values from a power meter.
*/
var PowerWindow = {};

/**
* Constructor for a Power Meter Window Class.
* @param id - ID for the power meter this window represents.
* @param name - Name of the power meter.
*/
PowerWindow.PowerWindow = function(id, name, category) {
  // Store a reference to 'this' for use in scope changes (will use this every where to prevent confusion).
  var self = this;
  
  /** ID for the power meter this window will show the value for. */
  self.id = id;
  /** Text for kwh. */
  self.kwhText = "";
  /** Text for watts. */
  self.wattsText = "";
  
  /** Pebble window object this window is wrapping. */
  self.window = new UI.Card({
    fullscreen: true,
    title: name,
    action: {
      select: 'images/refresh.png',
      background: 'black'
    }
  });

  /** 
  * Show this window.
  */
  self.show = function() {
    self.window.show();
  };
  
  /**
  * Fetch the current value of a power meter.
  * @param id - The id for the power meter
  */
  self.fetchValue = function(id, variableName) {
    var url = Settings.option('url') + "id=variableget&DeviceNum=" + id + "&serviceId=urn:micasaverde-com:serviceId:EnergyMetering1&Variable=" + variableName;
    
    ajax({
      url: url,
      type: "GET",
      dataType: "json",
      headers: Settings.option('headers')
    },
      function(data) { 
        console.log("Successfully got sensor data."); 

        // Hack to get things to work :(
        if (variableName == "Watts") {
          self.wattsText = data;
        } else if (variableName == "KWH") {
          self.kwhText = data;
        }
        
        console.log(data);
        console.log(self.wattsText + " : " + self.kwhText);
        self.window.body("Watts: " + self.wattsText + "\nKWh: " + self.kwhText);
      },
      function(error) { console.log('Failed to get sensor data: ' + error); }
    );
  };
  
    
  self.window.on('click', 'select', function(e) {
    self.fetchValue(self.id, "Watts");
    self.fetchValue(self.id, "KWH");
  });
  
  self.fetchValue(self.id, "Watts");
  self.fetchValue(self.id, "KWH");
};



/** Exporting module for use in other files. */
if (typeof module != 'undefined' && module.exports) module.exports = PowerWindow; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return PowerWindow; }); // AMD