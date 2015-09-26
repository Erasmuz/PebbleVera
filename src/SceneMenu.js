/* jshint node:true *//* global define, escape, unescape */
'use strict';
var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

var SceneMenu = {};

SceneMenu.menu = new UI.Menu();
SceneMenu.itemCount = 0;

SceneMenu.addItem = function(name, id) {
  SceneMenu.menu.item(0, SceneMenu.itemCount, { title: name, id: id });
  SceneMenu.itemCount++;
};

SceneMenu.menu.on('select', function(e) {
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

if (typeof module != 'undefined' && module.exports) module.exports = SceneMenu; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return SceneMenu; }); // AMD