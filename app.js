var express = require('express');
var app = express();
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var compiler = webpack(webpackConfig);
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true, publicPath: webpackConfig.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));

app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/static'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/models', express.static(__dirname + '/models'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/demo', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/demo.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//setup for database
var User = require('./models/accounts.js');
mongoose.connect('mongodb://localhost:27017/test');

//TEST
var ellen = new User({
	username:'ellen',
	password: 'password'
});

ellen.save(function (err){
	if (err) throw err;
	console.log("user saved!");
});

User.find({ username: 'ellen' }, function(err, user) {
  if (err) throw err;

  // object of the user
  console.log(user);
});
