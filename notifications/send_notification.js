'use strict';
var gcm = require('node-gcm');
var database = require('../database/postgres.js');

exports.sendNotification = function(title, messageNotif) {
    //TODO Add Logs
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
                    console.log('sending notification with result : ' + JSON.stringify(result));
                }
            });
        } else {
            console.log('No notification clients found');
        }
    });
};
