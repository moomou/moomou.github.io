var path = require('path');
var webpack = require('webpack');

// For having a separate stylesheet to avoid FOUC.
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './index.js'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },

  module: {
    loaders: [
      // ES6 support
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // SASS compilation
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style',
            'css!autoprefixer!sass?outputStyle=expanded&includePaths[]=' + path.resolve(__dirname, './node_modules'))
      }
    ]
  },

  externals: {
  },

  resolve: {
    modulesDirectories: ['src', 'sass', 'node_modules'],
    extensions: ['', '.js', '.json', '.coffee', '.jsx']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].css')
  ]
};

