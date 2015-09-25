/**
 * Authentication for vera servers.
 *
 * @namespace
 */
/* jshint node:true *//* global define, escape, unescape */
'use strict';

var Sha1 = require('sha1');
var ajax = require('ajax');
var base64 = require('base64');
var Settings = require('settings');
var completedCallback;

var Auth = {};

Auth.PK_Device = 0;
Auth.defaultTokenServer = "https://vera-us-oem-authd11.mios.com/info/session/token";
Auth.serverRelayURL = "";

/**
* Gets a user token from the vera servers.
*/
Auth.getUserToken = function(username, password, callback) {
  completedCallback = callback;
  var shaSeed = Sha1.hash(username + password + "oZ7QE6LcLJp6fiWzdqZc");
  var urlString = "https://vera-us-oem-autha11.mios.com/autha/auth/username/" + username + "?SHA1Password=" + shaSeed + "&PK_Oem=1";
  
  ajax({
    url: urlString,
    type: 'GET',
    dataType: 'text'
  },
  function(data) {
    Auth.getSessionToken(JSON.parse(data));
  },
  function(error) {
    console.log('Failed getting user token: ' + error);
  });
};

/**
* Gets a session token from a server.
*/
Auth.getSessionToken = function(tokenData, server, callback) {
  server = typeof server !== 'undefined' ? server : Auth.defaultTokenServer;
  callback = typeof callback !== 'undefined' ? callback : Auth.getServerDevice;
  
  ajax({
    url: server,
    type: "GET",
    dataType: "text",
    headers: { 'MMSAuth': tokenData.Identity, 'MMSAuthSig': tokenData.IdentitySignature }
  },
  function(data) {
    callback(tokenData, data);
  },
  function(error) {
    // Failure!
    console.log('Failed getting session token: ' + error);
  });
};

/**
* Gets a list of devices on the LAN.  If nothing is returned it then
*  gets all available remotely connected devices.
*   TODO: Handle available controllers on LAN
*/
Auth.getServerDevice = function(tokenData, sessionToken) {
  ajax({
    url: 'https://vera-us-oem-authd11.mios.com/locator/locator/locator',
    type: "GET",
		dataType: "json",
    headers: { 'MMSSession': sessionToken }
  },
  function(data) {
    if (Object.keys(JSON.parse(data)).length === 0) {
      //Must be remote connection?  There should be a better way to check for this?
      Auth.getSessionToken(tokenData, "https://" + tokenData.Server_Account + "/info/session/token", Auth.getRemoteDevices);
    } else {
      //TODO: Handle LAN Controller
    }
  },
  function(error) {
    // Failure!
    console.log('Failed getting server device: ' + error);
  });
};

/**
* Gets the collection of controllers available.
*/
Auth.getRemoteDevices = function(tokenData, sessionToken) {
  var json = JSON.parse(base64.decode(tokenData.Identity));
  var PK_Account = json.PK_Account;
      
  ajax({
    url: "https://" + tokenData.Server_Account + "/account/account/account/" + PK_Account + "/devices",
    type: "GET",
    dataType: "json",
    headers: { 'MMSSession': sessionToken }
  },
  function(data) {
    // Only supporting a single controller for now
    var controller = JSON.parse(data).Devices[0];
    Auth.getRelayServer(controller, tokenData, sessionToken);
    
  },
  function(error) {
    console.log('Failed getting session token: ' + error);
  });
};

/**
* Gets the relay server to use to make requests to.
*/
Auth.getRelayServer = function(controllerData, tokenData, sessionToken) {
  Auth.PK_Device = controllerData.PK_Device;
  
  ajax({
    url: "https://" + controllerData.Server_Device + "/device/device/device/" + Auth.PK_Device,
    type: "GET",
    dataType: "json",
    headers: { 'MMSSession': sessionToken }
  },
  function(data) {
    Auth.serverRelay = JSON.parse(data).Server_Relay;
    Auth.getSessionToken(tokenData, "https://" + Auth.serverRelay + "/info/session/token", Auth.pollDevices);
  },
  function(error) {
    console.log('Failed getting Relay Server token: ' + error);
  });
};
  
/**
* Polls the abrreviated data from the relay server.
*/
Auth.pollDevices = function(tokenData, sessionToken) {
  ajax({
    url: "https://" + Auth.serverRelay + "/relay/relay/relay/device/" + Auth.PK_Device + "/port_3480/data_request?id=sdata",
    type: "GET",
    dataType: "json",
    headers: { 'MMSSession': sessionToken }
  },
  function(data) {
    Settings.option('data', JSON.parse(data));
    completedCallback();
  },
  function(error) {
    console.log('Failed getting Relay Server token: ' + error);
  });
};



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (typeof module != 'undefined' && module.exports) module.exports = Auth; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return Auth; }); // AMD