'use strict';
var gcm = require('node-gcm');
var database = require('../database/postgres');
var Logger = require('../utils/logger');
var logger = new Logger('Notifications');
var Notification = (function () {
    function Notification() {
    }
    Notification.sendNotification = function (title, messageNotif) {
        logger.info('Envoi d\'une notification -> {title:' + title + ', message:' + messageNotif + '}');
        database.getNotificationClients(function (results) {
            if (results.length > 0) {
                var message = new gcm.Message({
                    collapseKey: 'demo',
                    data: {
                        title: title,
                        message: messageNotif
                    }
                });
                var sender = new gcm.Sender(process.env.ANDROID_SERVER_KEY);
                var notificationIds = [];
                for (var notif in results) {
                    if (results.hasOwnProperty(notif)) {
                        notificationIds.push(results[notif].notification_id);
                    }
                }
                sender.send(message, notificationIds, notificationIds.length, function (err, result) {
                    logger.debug('sending notification with result -> ' + JSON.stringify(result));
                });
            }
            else {
                logger.info('No notification clients found');
            }
        }, function (err) {
            logger.error('Error while sending notification', err);
        });
    };
    return Notification;
})();
module.exports = Notification;
