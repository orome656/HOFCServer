'use strict';
var http = require('http');
var Logger = require('./logger');
var Utils = (function () {
    function Utils() {
    }
    Utils.downloadData = function (options, success, fail) {
        var logger = new Logger('Download');
        http.get(options, function (res) {
            var result = "";
            if (res.statusCode !== 200) {
                logger.errorMessage('Result code ' + res.statusCode);
                if (fail) {
                    fail(res);
                }
                return;
            }
            res.on('data', function (data) {
                result += data;
            });
            res.on('end', function () {
                logger.errorMessage('End getting response on ' + options.path);
                success(result);
            });
        }).on('error', function (e) {
            logger.errorMessage('Got error: ' + e.message);
            if (fail) {
                fail(e);
            }
        });
    };
    return Utils;
})();
module.exports = Utils;
