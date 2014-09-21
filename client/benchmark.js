window.onload = function () {
    var batchContainer = document.getElementById('batch-container');
    var noBatchContainer = document.getElementById('nobatch-container');

    // Draw empty diagram.
    drawDiagram(batchContainer, []);
    drawDiagram(noBatchContainer, []);

    var runButton = document.getElementById('run');

    // Running benchmark.
    runButton.addEventListener('click', function () {
        // With batching.
        runBenchmark(1, [], false, function (batchData) {
            drawDiagram(batchContainer, batchData);

            // Set timeout to prepare the server for new load.
            setTimeout(function () {
                // Without batching.
                runBenchmark(1, [], true, function (noBatchData) {
                    drawDiagram(noBatchContainer, noBatchData);
                });
            }, 100);
        });
    }, false);
};

var MAX_REQUESTS_NUMBER = 20;

/**
 * @param {HTMLElement} container
 * @param {Array} data
 */
function drawDiagram(container, data) {
    Flotr.draw(container, [data], {
        // Requests time, ms.
        yaxis: {
            min: 1,
            max: 70
        },
        // Number of concurrent requests.
        xaxis: {
            min: 1,
            max: MAX_REQUESTS_NUMBER
        }
    });
}

/**
 * Runs benchmark increasing number of requests each iteration.
 *
 * @param {Number} requestsNumber Initial number.
 * @param {Array} data An array to store data.
 * @param {Boolean} disableBatch
 * @param {Function} cb Called on complete with collected data.
 */
function runBenchmark(requestsNumber, data, disableBatch, cb) {
    request(disableBatch, requestsNumber, function (batchTime) {
        data.push([requestsNumber, batchTime]);
        if (requestsNumber++ <= MAX_REQUESTS_NUMBER) {
            runBenchmark(requestsNumber, data, disableBatch, cb);
        } else {
            cb(data);
        }
    });
}

/**
 * Performs the specified number of requests.
 *
 * @param {Boolean} disableBatch
 * @param {Number} requestsNumber
 * @param {Function} fn Callback function is invoked with the response time.
 */
function request(disableBatch, requestsNumber, fn) {
    var api = getApi(disableBatch);
    var startTime = new Date();
    var counter = 0;
    var i = requestsNumber;
    while (i) {
        api.exec('ping')
            .then(function () {
                if (++counter === requestsNumber) {
                    fn(new Date() - startTime);
                }
            })
            .done();
        i--;
    }
}

/**
 * Returns an instance of Api with the specified batch option.
 *
 * @param {Boolean} disableBatch
 * @returns {bla.Api}
 */
var getApi = (function () {
    var cache = {};
    return function (disableBatch) {
        var key = String(disableBatch);
        if (!cache[key]) {
            cache[key] = new bla.Api('/api/', {disableBatch: disableBatch});
        }
        return cache[key];
    }
}());
