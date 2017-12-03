const wdioConfig = require('./wdio.conf.js');

wdioConfig.config.capabilities = [{
    browserName: 'chrome', //phantomjs
}];
wdioConfig.config.baseUrl = 'http://localhost:3099/';
wdioConfig.config.services = ['selenium-standalone']; //phantomjs
wdioConfig.config.reporters = ['dot'];

exports.config = wdioConfig.config;
