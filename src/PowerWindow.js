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
  /** ID for the power meter this window will show the value for. */
  this.id = id;
  /** Text for kwh. */
  var kwhText = "";
  /** Text for watts. */
  var wattsText = "";
  
  
  /** Pebble window object this window is wrapping. */
  var window = new UI.Card({
    fullscreen: true,
    title: name
  });

  /** 
  * Show this window.
  */
  this.show = function() {
    window.show();
  };
  
  /**
  * Fetch the current value of a power meter.
  * @param id - The id for the power meter
  */
  this.fetchValue = function(id, variableName, watts, kwh) {
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
          wattsText = data;
        } else if (variableName == "KWH") {
          kwhText = data;
        }
        
        window.body("Watts: " + wattsText + "\nKWh: " + kwhText);
      },
      function(error) { console.log('Failed to get sensor data: ' + error); }
    );
  };
  
  this.fetchValue(this.id, "Watts", wattsText);
  this.fetchValue(this.id, "KWH", kwhText);
};



/** Exporting module for use in other files. */
if (typeof module != 'undefined' && module.exports) module.exports = PowerWindow; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return PowerWindow; }); // AMD