const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env) => ({
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      TILE_LAYER_ACCESS_TOKEN: JSON.stringify(env.TILE_LAYER_ACCESS_TOKEN),
    }),
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/leaflet/dist/leaflet.css' },
        { from: 'node_modules/leaflet/dist/images/*.png', to: 'images' },
        { from: 'src/index.css'}
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'NC Registered Voters Map',
      scriptLoading: 'defer',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      }
    }),
    new HtmlWebpackTagsPlugin({
      tags: ['leaflet.css', 'index.css'],
      append: true
    })
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
});
