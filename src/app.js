/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
var Sha1 = require('sha1');
var ajax = require('ajax');
var base64 = require('base64');

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
  body: 'Press any button.'
});

main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});

// Set a configurable with the open callback
Settings.config(
  { url: 'http://erasmuz.github.io/PebbleVera' },
  function(e) {
    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    } else {
      refreshVera();
    }
  }
);

function refreshVera() {
  var username = Settings.option('username');
  var password = Settings.option('password');
  
  var shaSeed = Sha1.hash(username + password + "oZ7QE6LcLJp6fiWzdqZc");
  //var urlString = "https://us-autha11.mios.com/autha/auth/username/{0}?SHA1Password={1}&PK_Oem=1".format(username,shaSeed);
	var urlString = "https://vera-us-oem-autha11.mios.com/autha/auth/username/" + username + "?SHA1Password=" + shaSeed + "&PK_Oem=1";
  
  ajax({
    url: urlString,
    type: 'GET',
    dataType: 'text'
  },
  function(data) {
    // Success!
    getSessionToken(JSON.parse(data));
  },
  function(error) {
    // Failure!
    console.log('Failed getting user token: ' + error);
  });
}

function getSessionToken(tokenData) {
  ajax({
    url: 'https://vera-us-oem-authd11.mios.com/info/session/token',
    type: "GET",
    dataType: "text",
    headers: { 'MMSAuth': tokenData.Identity, 'MMSAuthSig': tokenData.IdentitySignature }
  },
  function(data) {
    // Success!
    console.log('Successfully fetched vera! ' + data);
    getServerDevice(tokenData, data);
  },
  function(error) {
    // Failure!
    console.log('Failed getting session token: ' + error);
  });
}

function getServerDevice(tokenData, sessionToken) {
  ajax({
    url: 'https://vera-us-oem-authd11.mios.com/locator/locator/locator',
    type: "GET",
		dataType: "json",
    headers: { 'MMSSession': sessionToken }
  },
  function(data) {
    // Success!
    
    console.log('Successfully fetched vera! ' + JSON.parse(data));
    if (Object.keys(JSON.parse(data)).length === 0) {
      //Must not be on LAN?  There should be a better way to check for this?
      var json = JSON.parse(base64.decode(tokenData.Identity));
      var PK_Account = json.PK_Account;
      
      console.log(PK_Account);
      
    }
  },
  function(error) {
    // Failure!
    console.log('Failed getting server device: ' + error);
  });
}



//USE atob to get 64 bit encoding for remote access!
