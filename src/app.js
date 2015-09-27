/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var Settings = require('settings');
var Auth = require('Auth');
var MainApp = require('MainApp');


var app = new MainApp.MainApp();
app.show();


// Set a configurable with the open callback
Settings.config(
  { url: 'http://erasmuz.github.io/PebbleVera' },
  function(e) {
    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    } else {
      Auth.getUserToken(Settings.option('username'), Settings.option('password'), app.refresh);
    }
  }
);


