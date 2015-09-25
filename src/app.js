/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var UI = require('ui');
var Settings = require('settings');
var Auth = require('Auth');
var LightMenu = require('LightMenu');

var mainMenu = new UI.Menu({
  sections: [{
    items: [{
      title: 'Lights'
    }, {
      title: 'Scenes'
    }, {
      title: 'Sensors'
    }, {
      title: 'Refresh'
    }]
  }]
});

mainMenu.on('select', function(e) {
  if (e.item.title == "Lights") {
    LightMenu.menu.show();    
  }
});

mainMenu.show();


// Set a configurable with the open callback
Settings.config(
  { url: 'http://erasmuz.github.io/PebbleVera' },
  function(e) {
    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    } else {
      Auth.getUserToken(Settings.option('username'), Settings.option('password'), refreshed);
    }
  }
);

function refreshed() {
  var devices = Settings.option('data').devices;
  
  for(var i = 0; i < devices.length; i++) {
    switch (devices[i].category) {
      case 3:
        LightMenu.addItem(devices[i].name, devices[i].id);
        break;
        
    }
  }
}

