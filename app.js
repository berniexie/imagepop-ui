var express = require('express');
var app = express();
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var compiler = webpack(webpackConfig);
var bodyParser = require('body-parser')

app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true, publicPath: webpackConfig.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));

app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/static'));
app.use('/public', express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.use('/api/login', require('./routes/api/login'));
app.use('/api/register', require('./routes/api/register'));
app.use('/api/fileupload', require('./routes/api/fileupload'));
app.use('/api/logout', require('./routes/api/logout'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
