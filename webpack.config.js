var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'lib/view/public/jsx');
var APP_DIR = path.resolve(__dirname, 'src/view/public/jsx');

var config = {
  entry: APP_DIR + '/client.jsx',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  output: {
    path: BUILD_DIR,
    filename: 'react.js'
  }
};

module.exports = config;