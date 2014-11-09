var ApiMethod = require('bla').ApiMethod;

module.exports = new ApiMethod({
    name: 'ping',
    action: function () {
        return 'pong';
    }
});
