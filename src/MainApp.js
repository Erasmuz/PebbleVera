/* jshint node:true *//* global define, escape, unescape */
'use strict';
/** Import Stuffs. */
var UI = require('ui');
var LightMenu = require('LightMenu');
var SceneMenu = require('SceneMenu');
var SensorMenu = require('SensorMenu');
var PowerMenu = require('PowerMenu');
var Settings = require('settings');
var Auth = require('Auth');

/**
* Main App Class.
* Sets up main menu for listing what menu options are available.
*/
var MainApp = {};

MainApp.MainApp = function () {
  /** Menu for accessing lights. */
  var lightMenu = new LightMenu.LightMenu();
  /** Menu for accessing scenes. */
  var sceneMenu = new SceneMenu.SceneMenu();
  /** Menu for accessing sensors. */
  var sensorMenu = new SensorMenu.SensorMenu();
  /** Menu for accessing power meters. */
  var powerMenu = new PowerMenu.PowerMenu();
  
  /** On screen menu for the user to select device categories. */
  this.mainMenu = new UI.Menu({
  sections: [{
    items: [{
      title: 'Lights'
    }, {
      title: 'Scenes'
    }, {
      title: 'Sensors'
    }, {
      title: 'Power Meters'
    }, {
      title: 'Refresh'
    }]
  }]
  });
  
  /**
  * Handler for a user selecting what menu they want to browse through.
  */
  this.mainMenu.on('select', function(e) {
    if (e.item.title == "Lights") {
      lightMenu.show();    
    } 
    else if(e.item.title == "Scenes") {
      sceneMenu.show();    
    }
    else if(e.item.title == "Sensors") {
      sensorMenu.show();
    }
    else if(e.item.title == "Power Meters") {
      powerMenu.show();
    }
    else if(e.item.title == "Refresh") {
      Auth.getUserToken(Settings.option('username'), Settings.option('password'), this.refresh);
    }
  });
  
  /**
  * Shows the main screen.
  */
  this.show = function() {
    this.mainMenu.show();
  };
  
  /**
  * Refreshes all data/menus in the application.
  */
  this.refresh = function() {
    // Get data
    var data = Settings.data('data');
    
    // Get Scenes
    var scenes = data.scenes;
    for(var i = 0; i < scenes.length; i++) {
      sceneMenu.addItem(scenes[i].name, scenes[i].id);
    }
    
    // Get Devices
    var devices = data.devices;
    for(i = 0; i < devices.length; i++) {
      switch (devices[i].category) {
        case 3:  //Binary Light
          lightMenu.addItem(devices[i].name, devices[i].id);
          break;
        case 2:  //Dimmable Light
          lightMenu.addItem(devices[i].name, devices[i].id, devices[i].category);
          break;
        case 16:  //Humidity Sensor
          sensorMenu.addItem(devices[i].name, devices[i].id, devices[i].category);
          break;
        case 17:  //Temp Sensor
          sensorMenu.addItem(devices[i].name, devices[i].id, devices[i].category);
          break;
        case 18:  //Light Sensor
          sensorMenu.addItem(devices[i].name, devices[i].id, devices[i].category);
          break;
        case 21: // Power Meter
          powerMenu.addItem(devices[i].name, devices[i].id);
          break;
      }
    }
  };
  
  // Refresh persisted data
  if (Settings.data('data')) this.refresh();
  // Configure connection type (LAN / Remote)
  //TODO:
};

/* Export javascript module for other files to access.  */
if (typeof module != 'undefined' && module.exports) module.exports = MainApp; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return MainApp; }); // AMD