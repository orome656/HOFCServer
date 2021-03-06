/**
 * Ce module permet l'utilisation d'une base de données PostgresSQL
 * Elle contient l'ensemble des méthodes permettant l'insertion, 
 * la mise a jour et la récupération des informations
 */
/// <reference path="../../typings/tsd.d.ts" />
'use strict';
import pg = require('pg');
import constants = require('../constants/constants');
import Actu = require('../models/actu');
import ClassementLine = require('../models/classementLine');
import Match = require('../models/match');
import Journee = require('../models/journee');
import Logger = require('../utils/logger');
var logger = new Logger('Postgres');

var pgQuery = function(/**string */text: string, /**array */values: Array<any>, /**function */cb: Function) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		if(err) {
			logger.error('Error while connecting to database', err);
			return;
		}
		client.query(text, values, function(err, result) {
			done();
			if(cb != null && typeof cb === 'function')
				cb(err, result);
		});
	});
};
class PostgresSQL {
	/**
	 * Permet d'initialiser les tables de la base de données
	 * @return {void}
	 */
	public static init = function() {
		pgQuery(constants.database.creation_table_notification_query, null, function(err) {
			if(err) {
				logger.errorMessage('Error creating notification table');
			}
		});
		pgQuery(constants.database.creation_table_classement_query, null, function(err) {
			if(err) {
				logger.errorMessage('Error creating classement table');
			}
		});
		pgQuery(constants.database.creation_table_calendrier_query, null, function(err) {
			if(err) {
				logger.errorMessage('Error creating calendrier table');
			}
		});
		pgQuery(constants.database.creation_table_actus_query, null, function(err) {
			if(err) {
				logger.errorMessage('Error creating actus table');
			}
		});
		pgQuery(constants.database.creation_table_journee_query, null, function(err) {
			if(err) {
				logger.errorMessage('Error creating journee table');
			}
		});
		pgQuery(constants.database.creation_table_agenda_query, null, function(err) {
			if(err) {
				logger.errorMessage('Error creating agenda table');
			}
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
	 * 			- equipe1Complet
	 * 			- equipe2Complet
	 */
	public static insertCalendarLine = function (/* object */ match: Match) {
		pgQuery('insert into calendrier (date,equipe1,equipe2,score1,score2, categorie) VALUES ($1, $2, $3, $4, $5, $6)',
				[match.date, match.equipe1Complet, match.equipe2Complet, match.score1, match.score2, match.categorie], 
				function(err/**, results*/) {
					if(err) {
						logger.error('Fail inserting match informations', err.detail);
					}
				}
		);
	};
	
	
	/**
	 * Permet d'insérer une ligne dans la table classement
	 * 
	 * @param {object} team details de l'équipe a insérer en base
	 * 		  L'objet contient les éléments suivant
	 * 			- points
	 * 			- joue
	 * 			- victoire
	 * 			- nul
	 * 			- defaite
	 * 			- bp
	 * 			- bc
	 * 			- diff
	 * 			- nom
	 */
	public static insertRankingLine = function (/* object */ team: ClassementLine) {
		pgQuery('insert into classement (nom,points,joue,gagne,nul,perdu,bp,bc,diff,categorie) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
				[team.nom, team.points, team.joue, team.gagne, team.nul, team.perdu, team.bp, team.bc, team.diff, team.categorie],
				function(err/**, results*/){
					if(err) {
						logger.error('Fail inserting ranking data', err);
					}
				}
		);
	};
	
	
	/**
	 * Permet d'insérer une ligne dans la table actus
	 * 
	 * @param {object} actu détails de l'actualité a insérer en base
	 * 		  L'objet contient les éléments suivant
	 * 			- postId
	 * 			- title
	 * 			- texte
	 * 			- link
	 * 			- image
	 * 			- date
	 */
	public static insertActusLine = function (/* object */ actu: Actu) {
		pgQuery('insert into actus (postId, titre, texte, url, image, date) VALUES ($1,$2,$3,$4,$5,$6)',
				[actu.postId, actu.titre, actu.texte, actu.url, actu.image, actu.date], 
				function (err/**, results*/) {
					if(err) {
						logger.errorMessage('Fail inserting actus data');
					}
				}
		);
	};
	
	/**
	 * Permet de mettre a jour une ligne dans la table calendrier
	 * 
	 * @param {object} match details du match a insérer en base
	 * 		  L'objet contient les éléments suivant
	 * 			- equipe1
	 * 			- score1
	 * 			- score2
	 * 			- equipe2
	 * 			- date
	 * 			- equipe1Complet
	 * 			- equipe2Complet
	 */
	public static updateCalendarLine = function (/* object */ match: Match) {
		pgQuery('UPDATE calendrier set date=$1, score1=$2, score2=$3, equipe1=$4, equipe2=$5 WHERE equipe1 LIKE $6 AND equipe2 LIKE $7 AND categorie LIKE $8',
				[match.date, match.score1, match.score2, match.equipe1Complet, match.equipe2Complet, '%'+match.equipe1+'%', '%'+match.equipe2+'%', match.categorie], 
				function(err/**, results*/) {
					if(err) {
						logger.error('Fail updating match informations', err);
					}
				}
		);
	};
	
	
	/**
	 * Permet de mettre a jour une ligne dans la table classement
	 * 
	 * @param {object} team details de l'équipe a insérer en base
	 * 		  L'objet contient les éléments suivant
	 * 			- points
	 * 			- joue
	 * 			- victoire
	 * 			- nul
	 * 			- defaite
	 * 			- bp
	 * 			- bc
	 * 			- diff
	 * 			- nom
	 */
	public static updateRankingLine = function (/* object */ team: ClassementLine) {
		pgQuery('UPDATE classement set points=$1, joue=$2, gagne=$3, nul=$4, perdu=$5, bp=$6, bc=$7, diff=$8 WHERE nom LIKE $9 and categorie LIKE $10',
				[team.points, team.joue, team.gagne, team.nul, team.perdu, team.bp, team.bc, team.diff, team.nom, team.categorie],
				function(err/**, results*/){
					if(err) {
						logger.error('Fail updating ranking data', err);
					}
				}
		);
	};
	
	
	/**
	 * Permet de mettre a jour une ligne dans la table actus
	 * 
	 * @param {object} actu détails de l'actualité a insérer en base
	 * 		  L'objet contient les éléments suivant
	 * 			- postId
	 * 			- title
	 * 			- texte
	 * 			- link
	 * 			- image
	 * 			- date
	 */
	public static updateActusLine = function (/* object */ actu: Actu) {
		pgQuery('update actus set titre=$1, texte=$2, url=$3, image=$4, date=$5 WHERE postId=$6',
				[actu.titre, actu.texte, actu.url, actu.image, actu.date, actu.postId], 
				function (err/**, results*/) {
					if(err) {
						logger.error('Fail updating actus data', err);
					}
				}
		);
	};
	
	/**
	 * Permet de récupérer la liste des matchs du calendrier
	 * @param {function} success
	 * @param {function} fail
	 * @return array
	 */
	public static getCalendarInfos = function(success :((res: Array<Match>) => void), fail): void {
		pgQuery('select * from calendrier order by date asc', null, function(err, results: pg.QueryResult) {
			if(err) {
				fail(err);
			} else {
				var res = new Array<Match>();
				for (var i in results.rows) {
					var m = new Match();
					m.equipe1 = results.rows[i].equipe1;
					m.equipe2 = results.rows[i].equipe2;
					m.score1 = results.rows[i].score1;
					m.score2 = results.rows[i].score2;
					m.date = results.rows[i].date;
					res.push(m);
				}
				success(res);
			}
		});
	};
	
	/**
	 * Permet de récupérer la liste des matchs du calendrier
	 * 
	 * @param {function} success
	 * @param {function} fail
	 * @return array
	 */
	public static getCalendarInfosByCategorie = function(categorie: string, success :((res: Array<Match>) => void), fail): void {
		pgQuery('select * from calendrier where categorie=$1 order by date asc', [categorie], function(err, results: pg.QueryResult) {
			if(err) {
				fail(err);
			} else {
				var res = new Array<Match>();
				for (var i in results.rows) {
					var m = new Match();
					m.equipe1 = results.rows[i].equipe1;
					m.equipe2 = results.rows[i].equipe2;
					m.score1 = results.rows[i].score1;
					m.score2 = results.rows[i].score2;
					m.date = results.rows[i].date;
					res.push(m);
				}
				success(res);
			}
		});
	};
	
	/**
	 * Permet de récupérer le classement du championnat
	 * @param {function} success
	 * @param {function} fail
	 * @return array
	 */
	public static getRankingInfos = function(/**function */success: ((res: Array<ClassementLine>)=>void), /**function */fail): void {
		pgQuery('select * from classement order by points desc, diff desc', null, function(err, results: pg.QueryResult) {
			if(err) {
				fail(err);
			} else {
				var res = new Array<ClassementLine>();
				for (var i in results.rows) {
					var c = new ClassementLine();
					c.nom = results.rows[i].nom;
					c.points = results.rows[i].points;
					c.joue = results.rows[i].joue;
					c.gagne = results.rows[i].gagne;
					c.nul = results.rows[i].nul;
					c.perdu = results.rows[i].perdu;
					c.bp = results.rows[i].bp;
					c.bc = results.rows[i].bc;
					c.diff = results.rows[i].diff;
					res.push(c);
				}
				success(res);
			}
		});
	};
	
	/**
	 * Permet de récupérer le classement du championnat
	 * @param {function} success
	 * @param {function} fail
	 * @return array
	 */
	public static getRankingInfosByCategorie = function(categorie: string, /**function */success: ((res: Array<ClassementLine>)=>void), /**function */fail): void {
		pgQuery('select * from classement where categorie LIKE $1 order by points desc, diff desc', [categorie], function(err, results: pg.QueryResult) {
			if(err) {
				fail(err);
			} else {
				var res = new Array<ClassementLine>();
				for (var i in results.rows) {
					var c = new ClassementLine();
					c.nom = results.rows[i].nom;
					c.points = results.rows[i].points;
					c.joue = results.rows[i].joue;
					c.gagne = results.rows[i].gagne;
					c.nul = results.rows[i].nul;
					c.perdu = results.rows[i].perdu;
					c.bp = results.rows[i].bp;
					c.bc = results.rows[i].bc;
					c.diff = results.rows[i].diff;
					res.push(c);
				}
				success(res);
			}
		});
	};
	/**
	 * Permet de récupérer la liste des actualités
	 * @param {function} success
	 * @param {function} fail
	 * @return {array} Liste des actualités
	 */
	public static getActusInfos = function(/**function */success: ((res: Array<Actu>) => void), /**function */fail): void {
		pgQuery('select * from actus order by date desc', null, function(err, results: pg.QueryResult) {
			if(err) {
				fail(err);
			} else {
				var res = new Array<Actu>();
				for (var i in results.rows) {
					var a = new Actu();
					a.date = results.rows[i].date;
					a.image = results.rows[i].image;
					a.postId = results.rows[i].postid;
					a.texte = results.rows[i].texte;
					a.titre = results.rows[i].titre;
					a.url = results.rows[i].url;
					res.push(a);
				}
				success(res);
			}
		});
	};
	
	/**
	 * Permet d'insérer un nouveau client aux notifications Push
	 * @param {string} notificationId identifiant du client a notifier
	 * @param {string} uuid identifiant du téléphone client
	 * @param {function} success
	 * @param {function} fail
	 */
	public static insertNotificationId = function(/**string */notificationId: string, /**string */uuid: string, /**function */success: Function, /**function */fail: Function): void {
		pgQuery(constants.database.creation_table_notification_query, null, null);
		pgQuery("SELECT * FROM notification_client where uuid='" + uuid +"'", null, function(err, result) {
			if(err) {
	            logger.error('Error while searching if uuid exist', err);
				fail(err);
	            return;
	        }
	        if(result.rows.length > 0) {
				pgQuery("UPDATE notification_client set notification_id=$1 WHERE uuid=$2", [notificationId, uuid], function(err/**, results*/) {
					if(err) {
						fail(err);
					} else {
						success();
					}
				});
	        } else {
				pgQuery("INSERT INTO notification_client (notification_id, uuid) VALUES ($1, $2)", [notificationId, uuid], function(err/**, results*/) {
					if(err) {
						fail(err);
					} else {
						success();
					}
				});
	        }
		});
	};
	
	/**
	 * Permet de sélectionner les informations d'une equipe par son nom dans 
	 * la table classement
	 * @param {string} nom Nom de l'équipe a récupérer
	 * @param {function} success
	 * @param {function} fail
	 * @return {object} Informations de l'équipe
	 */
	public static getRankByName = function(nom: string, success: (line: ClassementLine)=>void, fail) {
		pgQuery('select * from classement where nom LIKE $1', [nom], function(err, results: pg.QueryResult) {
			if(err) {
				fail(err);
			} else {
				if(results.rows.length > 0) {
					var line = new ClassementLine();
					line.fromObject(results.rows[0]);
					
					success(line);
				} else {
					success(null);
				}
			}
		});
	};
	
	/**
	 * Permet de sélectionner les informations d'un match par son nom dans 
	 * la table classement
	 * @param {string} equipe1 Nom de l'équipe a domicile
	 * @param {string} equipe2 Nom de l'équipe a l'extérieur
	 * @param {function} success
	 * @param {function} fail
	 * @return {object} Informations sur le match
	 */
	public static getMatchByName = function(equipe1: string, equipe2: string, success: (match: Match)=>void, fail: Function) {
		pgQuery('select * from calendrier where equipe1 LIKE $1 AND equipe2 LIKE $2', ['%'+equipe1+'%', '%'+equipe2+'%'], function(err, results: pg.QueryResult) {
			if(err) {
				fail(err);
			} else {
				if(results.rows.length > 0) {
					var result = new Match();
					result.fromObject(results.rows[0]);
					
					success(result);
				} else {
					success(null);
				}
			}
		});
	};
	
	/**
	 * Permet de sélectionner les informations actualité par son id
	 * @param {string} id Id de l'actualité
	 * @param {function} success
	 * @param {function} fail
	 * @return {object} Informations sur l'actualité
	 */
	public static getActuById = function(id: string, success: (result: Actu)=>void, fail: Function) {
		pgQuery('select * from actus where postId=$1', [id], function(err, results: pg.QueryResult) {
			if(err) {
				fail(err);
			} else {
				if(results.rows.length > 0) {
					var result: Actu = new Actu();
					result.fromObject(results.rows[0]);
					
					
					success(result);
				} else {
					success(null);
				}
			}
		});
	};
	
	/**
	 * Permet de récupérer les id des clients aux notifications
	 * @param {function} success callback de succes
	 * @param {function} fail callback d'erreur
	 */
	public static getNotificationClients = function(success: (array: Array<any>)=>void, fail: Function) {
		pgQuery("SELECT notification_id from notification_client", null, function(err, result: pg.QueryResult) {
			if(err) {
				fail(err);
			} else {
				success(result.rows);
			}
		});
	};
	
	public static insertJournee = function(journee: Journee, success: Function, fail: Function) {
		pgQuery("INSERT INTO journee (date,equipe1,equipe2,score1,score2,id_journee, infos, categorie) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", 
			[journee.date, journee.equipe1, journee.equipe2, journee.score1, journee.score2, journee.idJournee, journee.infos, journee.categorie], 
			function(err, result: pg.QueryResult) {
			if(err) {
				logger.error("Error while inserting journee", err);
				if(fail)
					fail(err);
			}
		});
	}
	
	public static updateJournee = function(journee: Journee, success: Function, fail: Function) {
		pgQuery('UPDATE journee set date=$1, score1=$2, score2=$3, equipe1=$4, equipe2=$5, id_journee=$6 WHERE equipe1 LIKE $6 AND equipe2 LIKE $7',
				[journee.date, journee.score1, journee.score2, journee.equipe1, journee.equipe2, journee.idJournee, '%'+journee.equipe1+'%', '%'+journee.equipe2+'%' ], 
			function(err, result: pg.QueryResult) {
				if(err) {
					logger.error("Error while updating journee", err);
					if(fail)
						fail(err);
				}
		});
	}
	
	public static getJournee = function(categorie: string, idJournee: number, success: Function, fail: Function) {
		pgQuery('SELECT * from journee where id_journee=$1 and categorie=$2 order by date asc', [idJournee, categorie], function(err, results) {
			if(err) {
				if(fail)
					fail(err);
			} else {
				
				var res = new Array<Journee>();
				for (var i in results.rows) {
					var j = new Journee();
					j.equipe1 = results.rows[i].equipe1;
					j.equipe2 = results.rows[i].equipe2;
					j.score1 = results.rows[i].score1;
					j.score2 = results.rows[i].score2;
					j.date = results.rows[i].date;
					j.idJournee = idJournee;
					j.infos = results.rows[i].infos;
					res.push(j);
				}
				success(res);
			}
		})
	}
	
	public static getJourneeByName = function(idJournee: number, equipe1: string, equipe2: string, success: Function, fail: Function) {
		pgQuery('SELECT * from journee where id_journee=$1 and equipe1 LIKE $2 and equipe2 LIKE $3 order by date asc', [idJournee, equipe1, equipe2], function(err, results) {
			if(err) {
				logger.error('Error while getting journee', err);
				if(fail)
					fail(err);
			} else {
				if(results.rows != null && results.rows.length > 0) {
					var j = new Journee();
					j.equipe1 = results.rows[0].equipe1;
					j.equipe2 = results.rows[0].equipe2;
					j.score1 = results.rows[0].score1;
					j.score2 = results.rows[0].score2;
					j.date = results.rows[0].date;
					j.infos = results.rows[0].infos;
					j.idJournee = idJournee;
					success(j);
				} else {
					success(null);
				}
			}
		})
	}
	
	public static deleteJournee = function(categorie: string, idJournee: number) {
		pgQuery('DELETE FROM journee where id_journee=$1 and categorie=$2', [idJournee, categorie], function(err) {
			if(err) {
				logger.error('Error while deleting journee', err);
			}
		})
	}
}

export = PostgresSQL;