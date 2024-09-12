'use strict';
const app = require('../index');
const request = require('request');
const ManagementClient = require('auth0').ManagementClient;
// import {AUTH0_TOKEN, CLIENT_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE } from "../config"
const envVar = require("../config")
module.exports = {
  options: {
    method: 'POST',
    url: envVar.AUTH0_TOKEN,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: envVar.AUTH0_CLIENT_ID,
      client_secret: envVar.AUTH0_CLIENT_SECRET,
      audience: envVar.AUTH0_AUDIENCE,
      grant_type: 'client_credentials',
    }),
  },
  getAuthToken: function() {
    console.info('--------Getting a new auth0 token--------', this.options.url);
    request(this.options, function(err, res, body) {      
      if (err) {
        console.error('Auth0 token Err===', err);
      }
      if (res && res.body) {
        const response = JSON.parse(res.body);
        if (response && response.access_token) {
          app.token = response.access_token;
          app.tokenExpiresAt = Date.now() + response.expires_in;
          app.management = new ManagementClient({
            token: response.access_token,
            domain: envVar.CLIENT_DOMAIN,
          });
        } else {
          console.error('res.body===',res.body);
        }
      }
    });
  },
  getToken: function() {
    if (!app.token || app.tokenExpiresAt < Date.now() - 300) {
      console.debug('Redirecting to get new auth token');
      this.getAuthToken();
    }
    return app.token;
  },
  refreshToken: async function() {
    if (!app.token) {
      console.debug('No token found. Redirecting to get new auth token!');
      await this.getAuthToken();
    }
    if (app.tokenExpiresAt < Date.now() - 300) {
      console.debug('Refreshing auth token from auth0');
      await this.getAuthToken();
    }
    return true;
  }
};