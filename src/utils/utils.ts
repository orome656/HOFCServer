/// <reference path="../../typings/tsd.d.ts" />
'use strict';
import http = require('http');
import Logger = require('./logger');

class Utils {
    /**
     * Permet de télécharger les données d'un site
     * @param {object} options Parametre pour http.get
     * @param {function} success Callback de succes
     * @param {function} fail Callback d'échec
     * @return {void}
     */
    public static downloadData(/**object */options, /**function */success, /**function */fail): void {
        var logger = new Logger('Download');
        http.get(options, function(res) {
                var result = "";
                if (res.statusCode !== 200) {
                    logger.errorMessage('Result code ' + res.statusCode);
                    if(fail) {
                        fail(res);
                    }
                    return;
                }
                res.on('data', function (data) {
                    result += data;
                });
    
                res.on('end', function () {
                    logger.info('End getting response on ' + options.path);
                    success(result);
                });
        }).on('error', function(e) {
            logger.errorMessage('Got error: ' + e.message);
            if(fail) {
                fail(e);
            }
        });
    }
    
    /**
     * Permet de formatter une date pour l'envoi au client
     * YYYY-MM-DDTHH:MI:SS.sssZ
     */
    public static formatDate(date: Date): string {
        return date.getFullYear() + '-' + ((date.getMonth()<=9)?'0'+date.getMonth():date.getMonth())+'-'
                +((date.getDate()<=9)?'0'+date.getDate():date.getDate())+'T'+((date.getHours()<=9)?'0'+date.getHours():date.getHours())+':'
                +((date.getMinutes()<=9)?'0'+date.getMinutes():date.getMinutes())+':'+((date.getSeconds()<=9)?'0'+date.getSeconds():date.getSeconds())+'.000Z';
    }
    
    /**
     * Permet de formatter une date pour l'envoi au client
     * YYYY-MM-DD HH:MI:SS
     */
    public static formatDateAgenda(date: Date): string {
        return date.getFullYear() + '-' + ((date.getMonth()<=9)?'0'+date.getMonth():date.getMonth())+'-'
                +((date.getDate()<=9)?'0'+date.getDate():date.getDate())+' '+((date.getHours()<=9)?'0'+date.getHours():date.getHours())+':'
                +((date.getMinutes()<=9)?'0'+date.getMinutes():date.getMinutes())+':'+((date.getSeconds()<=9)?'0'+date.getSeconds():date.getSeconds());
    }
    
    public static arrayToString(array: Array<any>): string {
        return '['+array.toString()+']';
    }
}

export = Utils;