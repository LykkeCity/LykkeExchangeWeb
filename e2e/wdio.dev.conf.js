const wdioConfig = require('./wdio.conf.js');

wdioConfig.config.capabilities = [{
    browserName: 'chrome', //chrome
}];
wdioConfig.config.baseUrl = 'http://localhost:3000/';
wdioConfig.config.services = ['selenium-standalone']; //selenium-standalone
wdioConfig.config.reporters = ['dot'];

exports.config = wdioConfig.config;
