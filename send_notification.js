var gcm = require('node-gcm');

exports.sendNotification = function(db, title, messageNotif) {
    db.serialize(function() {
        db.all("SELECT notification_id from notification_client", function(err, results){
            if(err) {
                console.log('Error while getting notifications clients : ' + err);
                return;
            }
            
            
            // create a message with default values
            var message = new gcm.Message();

            // or with object values
            var message = new gcm.Message({
                collapseKey: 'demo',
                delayWhileIdle: true,
                timeToLive: 3,
                data: {
                    title: title,
                    message: messageNotif
                }
            });

            var sender = new gcm.Sender(process.env.ANDROID_SERVER_KEY); //TODO
            var notificationIds = [];
            for(var notif in results) {
                notificationIds.push(results[notif].notification_id);   
            }
            
            /**
             * Params: message-literal, registrationIds-array, No. of retries, callback-function
             **/
            sender.send(message, notificationIds, notificationIds.length, function (err, result) {
                console.log(result);
            });
        })
    })
}
