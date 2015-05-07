var pg = require('pg');
var constants = require('../constants.js');


var pgQuery = function(/**string */text, /**array */values, /**function */cb) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(text, values, function(err, result) {
			done();
			cb(err, result);
		});
	});
};

/**
 * Permet d'insérer une ligne dans la table calendrier
 * 
 * @param match object details du match a insérer en base
 * 		  L'objet contient les éléments suivant
 * 			- equipe1
 * 			- score1
 * 			- score2
 * 			- equipe2
 * 			- date
 */
exports.insertCalendarLine = function (/* object */ match) {
	
};

/**
 * Permet de récupérer la liste des matchs du calendrier
 * @return array
 */
exports.getCalendarInfos = function(success, fail) {
	pgQuery('select * from calendrier order by date asc', null, function(err, results) {
		if(err) {
			fail(err);
		} else {
			success(results.rows);
		}
	});
};


/**
 * Permet de récupérer le classement du championnat
 * @return array
 */
exports.getRankingInfos = function(success, fail) {
	pgQuery('select * from classement order by points desc, diff desc', null, function(err, results) {
		if(err) {
			fail(err);
		} else {
			success(results.rows);
		}
	});
};

/**
 * Permet de récupérer la liste des actualités
 * @return array
 */
exports.getActusInfos = function(success, fail) {
	pgQuery('select * from actus order by date desc', null, function(err, results) {
		if(err) {
			fail(err);
		} else {
			success(results.rows);
		}
	});
};

exports.insertNotificationId = function(notificationId, uuid, success, fail) {
	pgQuery(constants.database.creation_table_notification_query);
	pgQuery("SELECT * FROM notification_client where uuid='" + uuid +"'", null, function(err, result) {
		if(err) {
            console.log('Error while searching if uuid exist ' + err);
			fail(err);
            return;
        }
        if(result.rows.length > 0) {
			pgQuery("UPDATE notification_client set notification_id='"+notificationId+"' WHERE uuid='"+uuid+"'", null, function(err, results) {
				if(err) {
					fail(err);
				} else {
					success();
				}
			});
        } else {
			pgQuery("INSERT INTO notification_client (notification_id, uuid) VALUES ('"+notificationId+"','"+uuid+"')", null, function(err, results) {
				if(err) {
					fail(err);
				} else {
					success();
				}
			});
        }
	});
};