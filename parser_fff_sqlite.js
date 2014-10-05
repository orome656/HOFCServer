var jsdom = require("jsdom");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("../database_hofc.db");

// Paramètrage url
var urlClassement = "http://www.fff.fr/championnats/fff/district-hautes-pyrenees/2013/294485-excellence/phase-1/poule-1/derniers-resultats";
var urlLastResult = "http://www.fff.fr/championnats/fff/district-hautes-pyrenees/2013/294485-excellence/phase-1/poule-1/derniers-resultats";
var urlCalendrier = "http://www.fff.fr/la-vie-des-clubs/177005/calendrier/liste-matchs-a-venir/294485/phase-1/groupe-1";
var urlActus = "http://www.hofc.fr/category/seniors/";

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
        "aout":"08",
        "septembre":"09",
        "octobre":"10",
        "novembre":"11",
        "décembre":"12"
};

/**
 * Query création des tables
 */
var creation_table_classement_query = "CREATE TABLE IF NOT EXISTS `classement` (`id` int(11) PRIMARY KEY, `nom` varchar(255) NOT NULL, `points` int(11) NOT NULL, `joue` int(11) NOT NULL, `gagne` int(11) NOT NULL, `nul` int(11) NOT NULL, `perdu` int(11) NOT NULL, `bp` int(11) NOT NULL, `bc` int(11) NOT NULL, `diff` int(11) NOT NULL)";
var creation_table_calendrier_query = "CREATE TABLE IF NOT EXISTS `calendrier` (`id` int(11) PRIMARY KEY, `equipe1` varchar(255) NOT NULL, `score1` int(11) NOT NULL, `equipe2` varchar(255) NOT NULL, `score2` int(11) NOT NULL, `date` date DEFAULT NULL)";
var creation_table_actus_query = "CREATE TABLE IF NOT EXISTS `actus` (`id` int(11) PRIMARY KEY, `postId` int(11) DEFAULT NULL, `titre` varchar(255) DEFAULT NULL, `texte` text, `url` varchar(255) DEFAULT NULL, `image` varchar(255) DEFAULT NULL, `date` date DEFAULT NULL)";
/**
 * Paramétrage activation récupération des infos
 */
var activerRecupClassement = true;
var activerRecupCalendrier = true;
var activerRecupActu = true;

var doAfterQuery = function (errors, resultats) {
									  if (errors) {
										  console.log('Erreur de mise a jour ' + errors);
										  return;
									  }
									  console.log('Mise a jour OK');
									  if (--nbLines == 0) {
										db.close();
									  }
								  }

db.serialize(function() {
	if (activerRecupClassement) {
		db.run(creation_table_classement_query);
		jsdom.env(
		  urlClassement,
		  ["http://code.jquery.com/jquery.js"],
		  function (errors, window) {
			  
			  var linesClassement = window.$("table.classement").children('tbody').children().filter(function (index) {
				  return (window.$(this).children() != null && window.$(this).children().length > 3);
			  });
			  var nbLines = linesClassement.length;
			  window.$(linesClassement).each(function (index, line) {
				  var lineChildren = window.$(line).children();
				  if (lineChildren != null && lineChildren.length > 3) {
					  var nom = window.$(lineChildren[1]).text().trim();
					  var points = window.$(lineChildren[2]).text();
					  var joue = window.$(lineChildren[3]).text();
					  var victoire = window.$(lineChildren[4]).text();
					  var nul = window.$(lineChildren[5]).text();
					  var defaite = window.$(lineChildren[6]).text();
					  var bp = window.$(lineChildren[8]).text();
					  var bc = window.$(lineChildren[9]).text();
					  var diff = window.$(lineChildren[11]).text();
					  db.get('select * from classement where nom LIKE "' + nom + '"',  function (err, results) {
						  if (err) {
							  console.log('Erreur ' + err);
							  return;
						  }
						  if (results != null) {
							  db.run('UPDATE classement set points=' + points + ', joue=' + joue + ', gagne=' + victoire + ', nul=' + nul + ', perdu=' + defaite + ', bp=' + bp + ', bc=' + bc + ', diff=' + diff + ' WHERE nom LIKE "' + nom + '"',doAfterQuery);
						  } else {
							  db.run('insert into classement (nom,points,joue,gagne,nul,perdu,bp,bc,diff) VALUES ("' + nom + '",' + points + ',' + joue + ' , ' + victoire + ',' + nul + ',' + defaite + ', ' + bp + ',' + bc + ',' + diff + ')',doAfterQuery);
						  }

					  });
				  }
			  });
		  }
		);
	}

	if (activerRecupCalendrier) {
		db.run(creation_table_calendrier_query);
		jsdom.env(
		  urlCalendrier,
		  ["http://code.jquery.com/jquery.js"],
		  function (errors, window) {
			  
			  var linesCalendar = window.$("div.list_calendar").children('div');
			  var nbLines = linesCalendar.length;
			  console.log(nbLines);
			  window.$(linesCalendar).each(function (index, line) {
				  var lineChildren = window.$(line).children();
				  var date = window.$(lineChildren[0]).text().trim();
				  var equipe1 = window.$(window.$(lineChildren[1]).children()[0]).text().trim();
				  equipe1 = equipe1.replace(/\r?\n|\r/g,' ');
				  equipe1 = equipe1.replace(/ +/g,' ');
				  console.log('equipe1 ' + equipe1);
				  var equipe2 = window.$(window.$(lineChildren[1]).children()[2]).text().trim();
				  equipe2 = equipe2.replace(/\r?\n|\r/g,' ');
				  equipe2 = equipe2.replace(/ +/g,' ');
				  console.log('equipe2 ' + equipe2);
				  
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

				  
				  var score = window.$(window.$(lineChildren[1]).children()[1]).text().trim();
				  var score1 = null;
				  var score2 = null;

				  if (score.indexOf('-') != -1) {
					  score1 = score.split('-')[0];
					  score2 = score.split('-')[1];
				  }

				  db.run('select * from calendrier where equipe1 LIKE "' + equipe1 + '" AND equipe2 LIKE "' + equipe2 + '"', function (err, results) {
					  if (err) {
						  console.log('Erreur ' + err);
						  return;
					  }
					  if (results != null) {
						  db.run('UPDATE calendrier set date="' + annee+'-'+mois+'-'+jour + ' ' + heure + ':'
								  + minute + ':00' + '", score1=' + score1 + ', score2=' + score2 + ' WHERE equipe1 LIKE "' + equipe1 + '" AND equipe2 LIKE "' + equipe2 + '"',doAfterQuery);
					  } else {
						  db.run('insert into calendrier (date,equipe1,equipe2,score1,score2) VALUES ("' + annee+'-'+mois+'-'+jour + ' ' + heure + ':'
								  + minute + ':00' + '","' + equipe1 + '","' + equipe2 + '","' + score1 + '","' + score2 + '")',doAfterQuery);
					  }

				  });
			  });
		  }
		);
	}

	if(activerRecupActu) {
		db.run(creation_table_actus_query);
		console.log('Doing recup actu');
		jsdom.env(urlActus, ["http://code.jquery.com/jquery.js"],function(error, window){
			console.log('Recup actu start');
			
			var linesActu = window.$("#content").children('.post');
			var nbLines = linesActu.length;
			console.log('Actus to get ' + nbLines);
			window.$(linesActu).each(function(index, line){
				var postId = line.id.split('-')[1]; 
				/**
				 * Title : {
				 *      href: url de l'actu
				 *      text: titre de l'actu
				 * }
				 */
				var title = window.$(line).children('.title').children().children()[0];
				var date = window.$(line).children('.postmeta').children()[0].innerHTML;
				var urlImage = window.$(line).children('.entry').children('a').children()[0].src;
				var texte = window.$(line).children('.entry').children('p')[0].innerHTML;
				
				var jour = date.split(' ')[0];
				var mois = listeMoisActu[date.split(' ')[1]];
				var annee = date.split(' ')[2];
				
				db.run('select * from actus where postId=' + postId, function (err, results) {
					if (err) {
						console.log('Erreur ' + err);
						return;
					}
					if (results != null) {
						db.run('update actus set titre="'+title.innerHTML+'", texte="'+texte+'", url="'+title.href+'", image="'+urlImage+'", date="' + annee+'-'+mois+'-'+jour + ' 00:00:00" WHERE postId='+postId, null,doAfterQuery);
					} else {
						db.run('insert into actus (postId, titre, texte, url, image, date) VALUES (' + postId + ',"'+title.innerHTML+'","' + texte + '","' + title.href + '","' + urlImage + '","' + annee+'-'+mois+'-'+jour + ' 00:00:00")', null,doAfterQuery);
					}
				});
			});
		});
	}

});






