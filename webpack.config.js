var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    index: [
      'babel-polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './client/index/components/landing_component.jsx'
    ],
    demo: [
      'babel-polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './client/demo/components/demo.js'
    ],
    main: [
      'babel-polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './client/main/main.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'static/'),
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'client'),
        loader: 'react-hot'
      },
      {
        test: /\.css?$/,
        include: path.resolve(__dirname, 'public/css'),
        loader: 'style!css'
      },
      {
        test: /\.ttf?$/,
        include: path.resolve(__dirname, 'public/fonts'),
        loader: 'file'
      },
      { 
        test: /\.png$/,
        loader: "url-loader?limit=10000&minetype=image/png" 
      },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'client'),
        loader: 'babel',
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0', 'react'],
        }
      }
    ]
  },
  debug: true
};
