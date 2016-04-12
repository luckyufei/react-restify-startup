require('babel-core/register');

const config = require('./webpack/config').default;
console.log('NODE_ENV: ', config.get('env'));

module.exports = require('./webpack/' + config.get('env'));
