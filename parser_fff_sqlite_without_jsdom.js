var http = require('http');
var cheerio = require("cheerio");
var sqlite3 = require("sqlite3").verbose();
var winston = require("winston");
var db = new sqlite3.Database("database_hofc.db");

/**
 * Defining loggers
 */
winston.add(winston.transports.File, { filename: './parser.log', level: 'debug'});
winston.remove(winston.transports.Console);
  
// Paramétrage url
var urlClassement = "http://www.fff.fr/championnats/fff/district-hautes-pyrenees/2013/294485-excellence/phase-1/poule-1/derniers-resultats";
var urlLastResult = "http://www.fff.fr/championnats/fff/district-hautes-pyrenees/2013/294485-excellence/phase-1/poule-1/derniers-resultats";
var urlCalendrier = "http://www.fff.fr/la-vie-des-clubs/177005/calendrier/liste-matchs-a-venir/294485/phase-1/groupe-1";
var urlActus = "http://www.hofc.fr/category/seniors/";

var optionsClassement = {
  host: '',
  port: 3128,
  path: 'http://www.fff.fr/championnats/fff/district-hautes-pyrenees/2014/305257-excellence/phase-1/poule-1/derniers-resultats',
  activated: false
};

var optionsCalendrier = {
  host: '',
  port: 3128,
  path: 'http://www.fff.fr/la-vie-des-clubs/177005/calendrier/liste-matchs-a-venir/305257/phase-1/groupe-1',
  activated: false
};

var optionsActus = {
  host: '',
  port: 3128,
  path: 'http://www.hofc.fr/category/seniors/',
  activated: true
};

/**
 * Query création des tables
 */
var creation_table_classement_query = "CREATE TABLE IF NOT EXISTS `classement` (`id` INTEGER PRIMARY KEY AUTOINCREMENT , `nom` varchar(255) NOT NULL, `points` int(11) NOT NULL, `joue` int(11) NOT NULL, `gagne` int(11) NOT NULL, `nul` int(11) NOT NULL, `perdu` int(11) NOT NULL, `bp` int(11) NOT NULL, `bc` int(11) NOT NULL, `diff` int(11) NOT NULL)";
var creation_table_calendrier_query = "CREATE TABLE IF NOT EXISTS `calendrier` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `equipe1` varchar(255) NOT NULL, `score1` int(11) NOT NULL, `equipe2` varchar(255) NOT NULL, `score2` int(11) NOT NULL, `date` date DEFAULT NULL)";
var creation_table_actus_query = "CREATE TABLE IF NOT EXISTS `actus` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `postId` int(11) DEFAULT NULL, `titre` varchar(255) DEFAULT NULL, `texte` text, `url` varchar(255) DEFAULT NULL, `image` varchar(255) DEFAULT NULL, `date` date DEFAULT NULL)";

/**
 *	Tableau permettant de convertir la chaine date récupérée en objet date
 */
var listeMois = {
        "JANVIER":"01",
        "FÉVRIER":"02",
        "MARS":"03",
        "AVRIL":"04",
        "MAI":"05",
        "JUIN":"06",
        "JUILLET":"07",
        "AOUT":"08",
        "SEPTEMBRE":"09",
        "OCTOBRE":"10",
        "NOVEMBRE":"11",
        "DÉCEMBRE":"12"
};

/**
 *	Tableau permettant de convertir la chaine date récupérée en objet date pour les actus
 */
var listeMoisActu = {
        "janvier":"01",
        "février":"02",
        "mars":"03",
        "avril":"04",
        "mai":"05",
        "juin":"06",
        "juillet":"07",
        "août":"08",
        "septembre":"09",
        "octobre":"10",
        "novembre":"11",
        "décembre":"12"
};

/**
 *
 */
var doAfterQuery = function (errors, resultats) {
	if (errors) {
		winston.error('Erreur de mise a jour ' + errors);
		return;
	}
	winston.info('Mise a jour OK');
}

winston.info('Parser start at ' + new Date());

if(optionsClassement.activated) {
	winston.info('Parser Classement Start');
	http.get(optionsClassement, function(res) {
		var result = "";
		if(res.statusCode != 200) {
			return;
		}
	    res.on('data', function(data) {
			result += data;
	    });
		
		res.on('end', function() {
			$ = cheerio.load(result);
			db.serialize(function() {
				db.run(creation_table_classement_query);
				var linesClassement = $("table.classement").children('tbody').children().filter(function (index) {
					return ($(this).children() != null && $(this).children().length > 3);
				});
				var nbLines = linesClassement.length;
				$(linesClassement).each(function (index, line) {
					var lineChildren = $(line).children();
					if (lineChildren != null && lineChildren.length > 3) {
						var nom = $(lineChildren[1]).text().trim();
						var points = $(lineChildren[2]).text();
						var joue = $(lineChildren[3]).text();
						var victoire = $(lineChildren[4]).text();
						var nul = $(lineChildren[5]).text();
						var defaite = $(lineChildren[6]).text();
						var bp = $(lineChildren[8]).text();
						var bc = $(lineChildren[9]).text();
						var diff = $(lineChildren[11]).text();
						db.get('select * from classement where nom LIKE "' + nom + '"',  function (err, results) {
							if (err) {
								winston.info('Erreur ' + err);
								return;
							}
                            winston.info('Updating Classement for team ' + nom);
							if (results != null) {
								db.run('UPDATE classement set points=' + points + ', joue=' + joue + ', gagne=' + victoire + ', nul=' + nul + ', perdu=' + defaite + ', bp=' + bp + ', bc=' + bc + ', diff=' + diff + ' WHERE nom LIKE "' + nom + '"',doAfterQuery);
							} else {
								db.run('insert into classement (nom,points,joue,gagne,nul,perdu,bp,bc,diff) VALUES ("' + nom + '",' + points + ',' + joue + ' , ' + victoire + ',' + nul + ',' + defaite + ', ' + bp + ',' + bc + ',' + diff + ')',doAfterQuery);
							}
						});
					}
				});
			});
		});
	}).on('error', function(e) {
	    winston.error("Got error: " + e.message);
	});
}


if(optionsCalendrier.activated) {
	winston.info('Parser Calendrier Start');
	http.get(optionsCalendrier, function(res) {
	  var result = "";
		if(res.statusCode != 200) {
			winston.info('Calendrier get error. Result code ' + res.statusCode);
			return;
		}
	    res.on('data', function(data) {
			result += data;
	    });
		
		res.on('end', function() {
			$2 = cheerio.load(result);
			db.serialize(function() {
				db.run(creation_table_calendrier_query);
				var linesCalendar = $2("div.list_calendar").children('div');
			    var nbLines = linesCalendar.length;
			    winston.info(nbLines);
			    $2(linesCalendar).each(function (index, line) {
				    var lineChildren = $2(line).children();
				    var date = $2(lineChildren[0]).text().trim();
				    var equipe1 = $2($2(lineChildren[1]).children()[0]).text().trim();
				    equipe1 = equipe1.replace(/\r?\n|\r/g,' ');
				    equipe1 = equipe1.replace(/ +/g,' ');
					winston.info('equipe1 ' + equipe1);
					var equipe2 = $2($2(lineChildren[1]).children()[2]).text().trim();
					equipe2 = equipe2.replace(/\r?\n|\r/g,' ');
					equipe2 = equipe2.replace(/ +/g,' ');
					winston.info('equipe2 ' + equipe2);
				  
				    var jourComplet = date.split('-')[0];
				    var heureComplet = date.split('-')[1];
				    var jour = jourComplet.split(' ')[1];
				    var mois = listeMois[jourComplet.split(' ')[2].toUpperCase()];
				    var annee = jourComplet.split(' ')[3];
				    var heure = "00";
				    var minute = "00";
				    if(heureComplet) {
					    heure = heureComplet.split(':')[0];
					    minute = heureComplet.split(':')[1];
				    }

					var score = $2($2(lineChildren[1]).children()[1]).text().trim();
				    var score1 = null;
				    var score2 = null;

					if (score.indexOf('-') != -1) {
						score1 = score.split('-')[0];
						score2 = score.split('-')[1];
					}

					db.run('select * from calendrier where equipe1 LIKE "' + equipe1 + '" AND equipe2 LIKE "' + equipe2 + '"', function (err, results) {
						if (err) {
							winston.info('Erreur ' + err);
							return;
						}
                        winston.info('Updating Calendrier for match ' + equipe1 + ' - ' + equipe2);
						if (results != null) {
							db.run('UPDATE calendrier set date="' + annee+'-'+mois+'-'+jour + ' ' + heure + ':'
									+ minute + ':00' + '", score1=' + score1 + ', score2=' + score2 + ' WHERE equipe1 LIKE "' + equipe1 + '" AND equipe2 LIKE "' + equipe2 + '"',doAfterQuery);
						} else {
							db.run('insert into calendrier (date,equipe1,equipe2,score1,score2) VALUES ("' + annee+'-'+mois+'-'+jour + ' ' + heure + ':'
									+ minute + ':00' + '","' + equipe1 + '","' + equipe2 + '","' + score1 + '","' + score2 + '")',doAfterQuery);
						}

					});
				});
			});
		});
	}).on('error', function(e) {
	  winston.error("Got error: " + e.message);
	});
}

if(optionsActus.activated) {
    winston.info('Parser actus start at ' + new Date());
	http.get(optionsActus, function(res) {
	    var result = "";
		if(res.statusCode != 200) {
			return;
		}
	    res.on('data', function(data) {
			result += data;
	    });
		
		res.on('end', function() {
            winston.info('End getting response actus at ' + new Date());
			$3 = cheerio.load(result);
			db.serialize(function() {
				db.run(creation_table_actus_query);
				winston.info('Recup actu start');
				var linesActu = $3("#content").children('.post');
				var nbLines = linesActu.length;
				winston.info('Actus to get ' + nbLines);
				$3(linesActu).each(function(index, line){
                    winston.info('working on line :' + line);
					var postId = $3(line).attr('id').split('-')[1]; 
					/**
					 * Title : {
					 *      href: url de l'actu
					 *      text: titre de l'actu
					 * }
					 */
					var title = $3(line).children('.title').children().children();
					var date = $3(line).children('.postmeta').children('span').text();
					var urlImage = $3(line).children('.entry').children('a').children().attr('src');
					var texte = $3(line).children('.entry').children('p').text();
					
					var jour = date.split(' ')[0];
					var mois = listeMoisActu[date.split(' ')[1]];
					var annee = date.split(' ')[2];
                    
					db.run('select * from actus where postId=' + postId, function (err, results) {
						if (err) {
							winston.info('Erreur ' + err);
							return;
						}
                        winston.info('inserting acticle ' + title.text());
                        winston.info('Parameters : [postId='+postId+', titre='+title.text()+', texte='+texte+', url='+title.attr('href')+', image='+urlImage+', date='+annee+'-'+mois+'-'+jour+']')
						if (results != null) {
							db.run('update actus set titre="'+title.text()+'", texte="'+texte+'", url="'+title.attr('href') +'", image="'+urlImage+'", date="' + annee+'-'+mois+'-'+jour + ' 00:00:00" WHERE postId='+postId, null,doAfterQuery);
						} else {
                            var query = 'insert into actus (postId, titre, texte, url, image, date) VALUES (' + postId + ',"'+title.text()+'","' + texte + '","' + title.attr('href') + '","' + urlImage + '","' + annee+'-'+mois+'-'+jour + ' 00:00:00")'
							db.run(query, null,doAfterQuery);
						}
					});
				});
			});
		});
	}).on('error', function(e) {
	  winston.error("Got error: " + e.message);
	});
}






