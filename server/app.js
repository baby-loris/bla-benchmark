var express = require('express');
var bodyParser = require('body-parser');
var apiMiddleware = require('bla').apiMiddleware(__dirname + '/*.api.js');

var app = express();
var clientPath = __dirname + '/../client';

app.set('views', clientPath);
app.set('view engine', 'jade');

app.use('/bla', express.static(__dirname + '/../node_modules/bla/build'));
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
