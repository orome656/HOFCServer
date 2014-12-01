var gcm = require('node-gcm');

exports.updateDatabase = funtion(db, title, message) {
    db.serialize(function() {
        db.get("SELECT notification_id from notification_client", function(err, results){
            if(err) {
                // TODO log error
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
                    message: message
                }
            });

            var sender = new gcm.Sender('insert Google Server API Key here'); //TODO

            /**
             * Params: message-literal, registrationIds-array, No. of retries, callback-function
             **/
            sender.send(message, results, results.length, function (err, result) {
                console.log(result);
            });
        })
    })
}