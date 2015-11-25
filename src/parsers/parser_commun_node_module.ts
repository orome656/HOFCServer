import Match = require('../models/Match');
import database = require('../database/postgres');
import Logger = require('../utils/logger');
var logger = new Logger('Parser_Commun');
import constants = require('../constants/constants');
var HOFC_NAME = constants.constants.HOFC_NAME;
import notification = require('../notifications/send_notification');

class ParserCommunNodeModule {
	public static handleCalendrierLine(match: Match, equipe: string) {
		logger.debug('Trying to update calendar line');
		database.getMatchByName(match.equipe1, match.equipe2, function (result) {
			if (result != null ) {
				/**
					* Mise a jour des informations
					*/
				if((result.score1 === null) && 
					(result.score2 === null) && 
					match.score1 !== null && match.score2 !== null) {
					var notifTitle = 'Nouveau Résultat '+ equipe;
					var notifMessage = null;
					if(match.equipe1.indexOf(HOFC_NAME) != -1 && match.score1 > match.score2) {
						notifMessage = 'Victoire du HOFC (' + match.score1+ '-' + match.score2 +') face à ' + match.equipe2;
					} else if (match.equipe2.indexOf(HOFC_NAME) != -1 && match.score2 > match.score1) {
						notifMessage = 'Victoire du HOFC (' + match.score1+ '-' + match.score2 +') face à ' + match.equipe1;
					} else if(match.equipe1.indexOf(HOFC_NAME) != -1 && match.score1 < match.score2) {
						notifMessage = 'Défaite du HOFC (' + match.score1+ '-' + match.score2 +') face à ' + match.equipe2;
					} else if (match.equipe2.indexOf(HOFC_NAME) != -1 && match.score2 < match.score1) {
						notifMessage = 'Défaite du HOFC (' + match.score1+ '-' + match.score2 +') face à ' + match.equipe1;
					} else {
						notifMessage = 'Match nul entre le HOFC et ' + ((match.equipe1.indexOf(HOFC_NAME) != -1)? match.equipe2 : match.equipe1);
					}
					logger.info('Sending Notification with message : ' + notifMessage);
					notification.sendNotification(notifTitle, notifMessage, {"TYPE": "Calendrier"});
				}
				database.updateCalendarLine(match);
			} else {
				/**
					* Insertion d'une nouvelle ligne
					*/
				database.insertCalendarLine(match);
			}

		}, function(err) {
			logger.error('Error while getting match on database', err);
		});
	}
}

export = ParserCommunNodeModule;