var express = require('express');
var bodyParser = require('body-parser');
var bla = require('bla');
var api = new bla.Api(__dirname + '/*.api.js');
var apiMiddleware = bla.apiMiddleware(api);

var app = express();
var clientPath = __dirname + '/../client';
var nodeModulesPath = __dirname + '/../node_modules';

app.set('views', clientPath);
app.set('view engine', 'jade');

app.use('/bla', express.static(nodeModulesPath + '/bla/build'));
app.use('/flotr2', express.static(nodeModulesPath +  '/flotr2'));
app.use('/', express.static(clientPath));

app.use(bodyParser.json());
app.use('/api/:method?', apiMiddleware);

app.get('/', function (req, res) {
    res.render('index');
});

exports.start = function () {
    app.listen('8081', function () {
        console.log('http://localhost:8081');
    });
};
