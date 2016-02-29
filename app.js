var express = require('express');
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var compiler = webpack(webpackConfig);
var app = express();
var backend_server = express();

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));

app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/static'));
app.use('/public', express.static(__dirname + '/public'));
//app.use('/img', express.static(__dirname + '/public/img'));
//app.use('/css', express.static(__dirname + '/public/css'));
//app.use('/fonts', express.static(__dirname + '/public/fonts'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/demo', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/demo.html'));
});

app.get('/main', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/main.html'));
});

app.post('/api/upload_image', function(req, res) {
  // Just return spurious success for uploading the image
  return res.status(200).send(req.file);
});

app.listen(3000, function () {
    console.log('Deep Contrast app listening on port 3000!');
});

//This is for the mocked backend
backend_server.use('/app/api/admin', require('./routes/api/admin'));

backend_server.listen(3001, function() {
    console.log('Backend mocked API listening on port 3001!');
})
