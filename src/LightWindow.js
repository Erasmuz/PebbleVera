/* jshint node:true *//* global define, escape, unescape */
'use strict';
var UI = require('ui');
var Settings = require('settings');
var ajax = require('ajax');

var LightWindow = {};

LightWindow.LightWindow = function(id) {
  this.id = id;
  
  this.window = new UI.Window({
    fullscreen: true,
    action: {
      up: 'images/light_on.png',
      down: 'images/light_off.png',
      background: 'black'
    }
  });

  this.show = function() {
    this.window.show();
  };
  
  this.window.on('click', 'up', function() {
    LightWindow.setLightLevel(id, 1);   
  });
  
  this.window.on('click', 'down', function() {
    LightWindow.setLightLevel(id, 0); 
  });
};

LightWindow.setLightLevel = function(id, value) {
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


if (typeof module != 'undefined' && module.exports) module.exports = LightWindow; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return LightWindow; }); // AMD