/**
 * Ce module permet l'envoi de notifications aux clients de l'application
 */
'use strict';
var gcm = require('node-gcm');
var database = require('../database/postgres.js');

/**
 * Permet d'envoyer une notification aux client de l'application
 * @param {string} title Titre de la notification
 * @param {string} messageNotif Message de la notification
 * @return {void}
 */
exports.sendNotification = function(/**string */title, /**string */messageNotif) {
    console.log('[Notifications] : Envoi d\'une notification -> {title:'+title+', message:'+messageNotif+'}');
    database.getNotificationClients(function(results) {
        if(results.length > 0) {
            var message = new gcm.Message({
                collapseKey: 'demo',
                data: {
                    title: title,
                    message: messageNotif
                }
            });

            var sender = new gcm.Sender(process.env.ANDROID_SERVER_KEY);
            var notificationIds = [];
            for(var notif in results) {
                if(results.hasOwnProperty(notif)) {
                    notificationIds.push(results[notif].notification_id);
                }
            }

            /**
             * Params: message-literal, registrationIds-array, No. of retries, callback-function
             **/
            sender.send(message, notificationIds, notificationIds.length, function (err, result) {
                if(process.env.NODE_ENV === 'DEV') {
                    console.log('[Notifications] : sending notification with result -> ' + JSON.stringify(result));
                }
            });
        } else {
            console.log('[Notifications] : No notification clients found');
        }
    });
};
