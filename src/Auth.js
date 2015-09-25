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


Auth.refreshVera = function(username, password) {
  var shaSeed = Sha1.hash(username + password + "oZ7QE6LcLJp6fiWzdqZc");
  var urlString = "https://vera-us-oem-autha11.mios.com/autha/auth/username/" + username + "?SHA1Password=" + shaSeed + "&PK_Oem=1";
  
  ajax({
    url: urlString,
    type: 'GET',
    dataType: 'text'
  },
  function(data) {
    // Success!
    Auth.getSessionToken(JSON.parse(data));
  },
  function(error) {
    // Failure!
    console.log('Failed getting user token: ' + error);
  });
};


Auth.getSessionToken = function(tokenData) {
  ajax({
    url: 'https://vera-us-oem-authd11.mios.com/info/session/token',
    type: "GET",
    dataType: "text",
    headers: { 'MMSAuth': tokenData.Identity, 'MMSAuthSig': tokenData.IdentitySignature }
  },
  function(data) {
    // Success!
    console.log('Successfully fetched vera! ' + data);
    Auth.getServerDevice(tokenData, data);
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
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (typeof module != 'undefined' && module.exports) module.exports = Auth; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return Auth; }); // AMD