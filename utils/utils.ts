/// <reference path="../typings/node/node.d.ts" />
'use strict';
import http = require('http');

export class Utils {
    /**
     * Permet de télécharger les données d'un site
     * @param {object} options Parametre pour http.get
     * @param {function} success Callback de succes
     * @param {function} fail Callback d'échec
     * @return {void}
     */
    public static downloadData(/**object */options, /**function */success, /**function */fail): void {
        http.get(options, function(res) {
                var result = "";
                if (res.statusCode !== 200) {
                    console.error('[Download] : Result code ' + res.statusCode);
                    if(fail) {
                        fail(res);
                    }
                    return;
                }
                res.on('data', function (data) {
                    result += data;
                });
    
                res.on('end', function () {
                    console.log('[Download] : End getting response on ' + options.path);
                    success(result);
                });
        }).on('error', function(e) {
            console.log('[Download] : Got error: ' + e.message);
            if(fail) {
                fail(e);
            }
        });
    }
}