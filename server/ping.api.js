var ApiMethod = require('bla').ApiMethod;

module.exports = new ApiMethod('ping')
    .setAction(function () {
        return 'pong';
    });
