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

var Auth = {};
Auth.defaultTokenServer = "https://vera-us-oem-authd11.mios.com/info/session/token";

/**
* Gets a user token from the vera servers.
*/
Auth.getUserToken = function(username, password, callback) {
  var shaSeed = Sha1.hash(username + password + "oZ7QE6LcLJp6fiWzdqZc");
  var urlString = "https://vera-us-oem-autha11.mios.com/autha/auth/username/" + username + "?SHA1Password=" + shaSeed + "&PK_Oem=1";
  
  ajax({
    url: urlString,
    type: 'GET',
    dataType: 'text'
  },
  function(data) {
    // Success!
    callback(JSON.parse(data));
    //Auth.getSessionToken(JSON.parse(data));
  },
  function(error) {
    // Failure!
    console.log('Failed getting user token: ' + error);
  });
};


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
    // Success!
    console.log('Successfully fetched vera! ' + data);
    callback(tokenData, data);
  },
  function(error) {
    // Failure!
    console.log('Failed getting session token: ' + error);
  });
};


Auth.getServerDevice = function(tokenData, sessionToken) {
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
      //Must be remote connection?  There should be a better way to check for this?
      var json = JSON.parse(base64.decode(tokenData.Identity));
      var PK_Account = json.PK_Account;
      
      console.log(PK_Account);
      //var URL = "https://" + tokenData.Server_Account + "/account/account/account/" + PK_Account + "/devices";
      Auth.getSessionToken(tokenData, "https://" + tokenData.Server_Account + "/info/session/token", Auth.getRemoteDevices);
      
    }
  },
  function(error) {
    // Failure!
    console.log('Failed getting server device: ' + error);
  });
};

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
    // Success!
    console.log('Successfully fetched items! ' + data);
  },
  function(error) {
    // Failure!
    console.log('Failed getting session token: ' + error);
  });
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (typeof module != 'undefined' && module.exports) module.exports = Auth; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return Auth; }); // AMD