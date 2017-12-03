const wdioConfig = require('./wdio.conf.js');

wdioConfig.config.capabilities = [{
    browserName: 'phantomjs',
}];
wdioConfig.config.baseUrl = 'http://127.0.0.1:8080/';
wdioConfig.config.services = ['phantomjs'];

exports.config = wdioConfig.config;
