const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.cjs');
const path = require('path');

module.exports = merge(commonConfiguration, {
    mode: 'development', // Sets the mode to development
    devtool: 'inline-source-map', // Source maps support for easier debugging
    devServer: {
        static: {
          directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
      }
});
