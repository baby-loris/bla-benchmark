var cluster = require('cluster');

var workersCount = 2;

if (cluster.isMaster) {
    while (workersCount--) {
        cluster.fork();
    }

    cluster.on('exit', function (worker) {
        if (!worker.suicide) {
            cluster.fork();
        }
    });

    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(function (signal) {
        process.on(signal, function () {
            Object.keys(cluster.workers).forEach(function (id) {
                cluster.workers[id].destroy();
            });
            process.exit();
        });
    });
} else {
    var app = require('./app');
    app.start();
}
