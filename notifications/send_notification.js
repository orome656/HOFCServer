var gcm = require('node-gcm');

exports.sendNotification = function(db, title, messageNotif) {
    if(process.env.NODE_ENV == 'DEV') {
        console.log('Ready to send notification with params :[' +db+ ', ' +title+', '+ messageNotif + ']');
    }
    db.connect(process.env.DATABASE_URL ,function(err, client, done) {
        if(err) {
            console.log('Error while contacting database ' + err);
        }
        client.query("SELECT notification_id from notification_client", function(error, results){
            if(err) {
                console.log('Error while getting notifications clients : ' + error);
                return;
            }
            
            if(results.rows.length > 0) {
                // create a message with default values
                var message = new gcm.Message();

                // or with object values
                var message = new gcm.Message({
                    collapseKey: 'demo',
                    data: {
                        title: title,
                        message: messageNotif
                    }
                });

                var sender = new gcm.Sender(process.env.ANDROID_SERVER_KEY);
                var notificationIds = [];
                for(var notif in results.rows) {
                    notificationIds.push(results.rows[notif].notification_id);   
                }

                /**
                 * Params: message-literal, registrationIds-array, No. of retries, callback-function
                 **/
                sender.send(message, notificationIds, notificationIds.length, function (err, result) {
                    if(process.env.NODE_ENV == 'DEV') {
                        console.log('sending notification with result : ' + JSON.stringify(result));
                    }
                });
            } else {
                console.log('No notification clients found');
            }
            done();
        })
    })
}