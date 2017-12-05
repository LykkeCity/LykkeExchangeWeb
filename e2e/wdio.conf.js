const wdioConfig = require('./cucumber-boilerplate/wdio.conf.js');

wdioConfig.config.specs = [
    '../tests/**/*.feature',
];
wdioConfig.config.cucumberOpts.require = [
    './src/steps/given.js',
    './src/steps/then.js',
    './src/steps/when.js',
    '../steps/given.js',
    '../steps/then.js',
    '../steps/when.js',
];

exports.config = wdioConfig.config;