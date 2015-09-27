/* jshint node:true *//* global define, escape, unescape */
'use strict';
/** Import stuffs */
var UI = require('ui');
var Settings = require('settings');
var ajax = require('ajax');

/**
* Sensor window class. Window representation of a sesnor.
*  Gives the user the ability to get current values from a sensor.
*/
var SensorWindow = {};

/** 
* Mapping of category number to key for look-up.
*/
SensorWindow.categoryMap = { 
  16: ["HumiditySensor1", "CurrentLevel"], 
  17: ["TemperatureSensor1", "CurrentTemperature"], 
  18: ["LightSensor1", "CurrentLevel"] 
};

/**
* Constructor for a Sensor Window Class.
* @param id - ID for the sensor this window represents.
* @param name - Name of the sensor.
* @param category - The category for the sensor (required for key to pull value from)
* For details on categry see: http://wiki.micasaverde.com/index.php/Luup_UPNP_Files
*/
SensorWindow.SensorWindow = function(id, name, category) {
  /** ID for the sensor this window will show the value for. */
  this.id = id;
  /** Category for the sensor. */
  this.category = category;
  
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
  * Fetch the current value of a sensor.
  * @param id - The id for the sensor
  * @param category - category number for the sensor
  */
  this.fetchValue = function(id, category) {
    var vals = SensorWindow.categoryMap[category];
    var url = Settings.option('url') + "id=variableget&DeviceNum=" + id + "&serviceId=urn:upnp-org:serviceId:" + vals[0] + "&Variable=" + vals[1];
    
    ajax({
      url: url,
      type: "GET",
      dataType: "json",
      headers: Settings.option('headers')
    },
      function(data) { 
        console.log("Successfully got sensor data."); 
        window.body(data);
      },
      function(error) { console.log('Failed to get sensor data: ' + error); }
    );
  };
  
  this.fetchValue(this.id, this.category);
};



/** Exporting module for use in other files. */
if (typeof module != 'undefined' && module.exports) module.exports = SensorWindow; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return SensorWindow; }); // AMD