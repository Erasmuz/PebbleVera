/**
 * Simple entry point for the watch app.
 *    Creates a main menu and displays it.
 */
var Settings = require('settings');
var Auth = require('Auth');
var MainApp = require('MainApp');


var app = new MainApp.MainApp();
app.show();


/**
* Handling of user settings/configuration.
*/
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


