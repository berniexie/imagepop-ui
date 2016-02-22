var express = require('express');
var app = express();
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var compiler = webpack(webpackConfig);

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));

app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/static'));
app.use('/css', express.static(__dirname + '/css'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/main', function(req, res) {
  res.sendFile(path.join(__dirname + '/main.html'));
});

app.post('/api/upload_image', function(req, res) {
  // Just return spurious success for uploading the image
  return res.status(200).send(req.file);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
