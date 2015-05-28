'use strict';
var pg = require('pg');
var constants = require('../constants/constants');
var Logger = require('../utils/logger');
var logger = new Logger('Postgres');
var pgQuery = function (text, values, cb) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        if (err) {
            logger.error('Error while connecting to database', err);
            return;
        }
        client.query(text, values, function (err, result) {
            done();
            cb(err, result);
        });
    });
};
var PostgresSQL = (function () {
    function PostgresSQL() {
    }
    PostgresSQL.init = function () {
        pgQuery(constants.database.creation_table_notification_query, null, function (err) {
            if (err) {
                logger.errorMessage('Error creating notification table');
            }
        });
        pgQuery(constants.database.creation_table_classement_query, null, function (err) {
            if (err) {
                logger.errorMessage('Error creating classement table');
            }
        });
        pgQuery(constants.database.creation_table_calendrier_query, null, function (err) {
            if (err) {
                logger.errorMessage('Error creating calendrier table');
            }
        });
        pgQuery(constants.database.creation_table_actus_query, null, function (err) {
            if (err) {
                logger.errorMessage('Error creating actus table');
            }
        });
    };
    PostgresSQL.insertCalendarLine = function (match) {
        pgQuery('insert into calendrier (date,equipe1,equipe2,score1,score2) VALUES ($1, $2, $3, $4, $5)', [match.date, match.equipe1Complet, match.equipe2Complet, match.score1, match.score2], function (err) {
            if (err) {
                logger.error('Fail inserting match informations', err);
            }
        });
    };
    PostgresSQL.insertRankingLine = function (team) {
        pgQuery('insert into classement (nom,points,joue,gagne,nul,perdu,bp,bc,diff) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [team.nom, team.points, team.joue, team.gagne, team.nul, team.perdu, team.bp, team.bc, team.diff], function (err) {
            if (err) {
                logger.error('Fail inserting ranking data', err);
            }
        });
    };
    PostgresSQL.insertActusLine = function (actu) {
        pgQuery('insert into actus (postId, titre, texte, url, image, date) VALUES ($1,$2,$3,$4,$5,$6)', [actu.postId, actu.titre, actu.texte, actu.url, actu.image, actu.date], function (err) {
            if (err) {
                logger.errorMessage('Fail inserting actus data');
            }
        });
    };
    PostgresSQL.updateCalendarLine = function (match) {
        pgQuery('UPDATE calendrier set date=$1, score1=$2, score2=$3, equipe1=$4, equipe2=$5 WHERE equipe1 LIKE $6 AND equipe2 LIKE $7', [match.date, match.score1, match.score2, match.equipe1Complet, match.equipe2Complet, '%' + match.equipe1 + '%', '%' + match.equipe2 + '%'], function (err) {
            if (err) {
                logger.error('Fail updating match informations', err);
            }
        });
    };
    PostgresSQL.updateRankingLine = function (team) {
        pgQuery('UPDATE classement set points=$1, joue=$2, gagne=$3, nul=$4, perdu=$5, bp=$6, bc=$7, diff=$8 WHERE nom LIKE $9', [team.points, team.joue, team.gagne, team.nul, team.perdu, team.bp, team.bc, team.diff, team.nom], function (err) {
            if (err) {
                logger.error('Fail updating ranking data', err);
            }
        });
    };
    PostgresSQL.updateActusLine = function (actu) {
        pgQuery('update actus set titre=$1, texte=$2, url=$3, image=$4, date=$5 WHERE postId=$6', [actu.titre, actu.texte, actu.url, actu.image, actu.date, actu.postId], function (err) {
            if (err) {
                logger.error('Fail updating actus data', err);
            }
        });
    };
    PostgresSQL.getCalendarInfos = function (success, fail) {
        pgQuery('select * from calendrier order by date asc', null, function (err, results) {
            if (err) {
                fail(err);
            }
            else {
                success(results.rows);
            }
        });
    };
    PostgresSQL.getRankingInfos = function (success, fail) {
        pgQuery('select * from classement order by points desc, diff desc', null, function (err, results) {
            if (err) {
                fail(err);
            }
            else {
                success(results.rows);
            }
        });
    };
    PostgresSQL.getActusInfos = function (success, fail) {
        pgQuery('select * from actus order by date desc', null, function (err, results) {
            if (err) {
                fail(err);
            }
            else {
                success(results.rows);
            }
        });
    };
    PostgresSQL.insertNotificationId = function (notificationId, uuid, success, fail) {
        pgQuery(constants.database.creation_table_notification_query, null, null);
        pgQuery("SELECT * FROM notification_client where uuid='" + uuid + "'", null, function (err, result) {
            if (err) {
                logger.error('Error while searching if uuid exist', err);
                fail(err);
                return;
            }
            if (result.rows.length > 0) {
                pgQuery("UPDATE notification_client set notification_id=$1 WHERE uuid=$2", [notificationId, uuid], function (err) {
                    if (err) {
                        fail(err);
                    }
                    else {
                        success();
                    }
                });
            }
            else {
                pgQuery("INSERT INTO notification_client (notification_id, uuid) VALUES ($1, $2)", [notificationId, uuid], function (err) {
                    if (err) {
                        fail(err);
                    }
                    else {
                        success();
                    }
                });
            }
        });
    };
    PostgresSQL.getRankByName = function (nom, success, fail) {
        pgQuery('select * from classement where nom LIKE $1', [nom], function (err, results) {
            if (err) {
                fail(err);
            }
            else {
                success(results.rows);
            }
        });
    };
    PostgresSQL.getMatchByName = function (equipe1, equipe2, success, fail) {
        pgQuery('select * from calendrier where equipe1 LIKE $1 AND equipe2 LIKE $2', ['%' + equipe1 + '%', '%' + equipe2 + '%'], function (err, results) {
            if (err) {
                fail(err);
            }
            else {
                success(results.rows);
            }
        });
    };
    PostgresSQL.getActuById = function (id, success, fail) {
        pgQuery('select * from actus where postId=$1', [id], function (err, results) {
            if (err) {
                fail(err);
            }
            else {
                success(results.rows);
            }
        });
    };
    PostgresSQL.getNotificationClients = function (success, fail) {
        pgQuery("SELECT notification_id from notification_client", null, function (err, result) {
            if (err) {
                fail(err);
            }
            else {
                success(result.rows);
            }
        });
    };
    return PostgresSQL;
})();
exports.PostgresSQL = PostgresSQL;
