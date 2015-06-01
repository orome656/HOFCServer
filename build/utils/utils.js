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
    Utils.formatDate = function (date) {
        return date.getFullYear() + '-' + ((date.getMonth() <= 9) ? '0' + date.getMonth() : date.getMonth()) + '-' + ((date.getDate() <= 9) ? '0' + date.getDate() : date.getDate()) + 'T' + ((date.getHours() <= 9) ? '0' + date.getHours() : date.getHours()) + ':' + ((date.getMinutes() <= 9) ? '0' + date.getMinutes() : date.getMinutes()) + ':' + ((date.getSeconds() <= 9) ? '0' + date.getSeconds() : date.getSeconds()) + '.000Z';
    };
    return Utils;
})();
module.exports = Utils;
