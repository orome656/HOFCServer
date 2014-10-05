var jsdom = require("jsdom");
var mysql = require("mysql");
/*
var connection = mysql.createConnection({
  port     : 3306,
  host     : 'localhost',
  database : 'foot',
  user     : 'node',
  password : 'node'
});
*/
var connection = mysql.createConnection('mysql://foot:foot@localhost:3306/foot');

// Paramètrage url
var urlClassement = "http://www.fff.fr/championnats/fff/district-hautes-pyrenees/2013/294485-excellence/phase-1/poule-1/derniers-resultats";
var urlLastResult = "http://www.fff.fr/championnats/fff/district-hautes-pyrenees/2013/294485-excellence/phase-1/poule-1/derniers-resultats";
var urlCalendrier = "http://www.fff.fr/la-vie-des-clubs/177005/calendrier/liste-matchs-a-venir/294485/phase-1/groupe-1";

var urlActus = "http://www.hofc.fr/category/seniors/";

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

// Actu HOFC.fr
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
var activerRecupClassement = false;
var activerRecupCalendrier = false;
var activerRecupActu = true;

if (activerRecupClassement) {
    jsdom.env(
      urlClassement,
      ["http://code.jquery.com/jquery.js"],
      function (errors, window) {
          connection.connect();
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

                  connection.query('select * from classement where nom LIKE "' + nom + '"', function (err, results) {
                      if (err) {
                          console.log('Erreur ' + err);
                          return;
                      }
                      if (results.length > 0) {
                          connection.query('UPDATE classement set points=' + points + ', joue=' + joue + ', gagne=' + victoire + ', nul=' + nul + ', perdu=' + defaite + ', bp=' + bp + ', bc=' + bc + ', diff=' + diff + ' WHERE nom LIKE "' + nom + '"',
                              function (errors, resultats) {
                                  if (errors) {
                                      console.log('Erreur de mise a jour');
                                      return;
                                  }
                                  console.log('Mise a jour OK');
                                  if (--nbLines == 0) {
                                      connection.end();
                                  }
                              }
                          );
                      } else {
                          connection.query('insert into classement (nom,points,joue,gagne,nul,perdu,bp,bc,diff) VALUES ("' + nom + '","' + points + '","' + joue + '","' + victoire + '","' + nul + '","' + defaite + '", "' + bp + '","' + bc + '","' + diff + '")',
                              function (errors, resultats) {
                                  if (errors) {
                                      console.log('Erreur d\'insertion');
                                      connection.end();
                                      return;
                                  }
                                  console.log('Insertion OK');
                                  if (--nbLines == 0) {
                                      connection.end();
                                  }
                              }
                          );
                      }

                  });
              }
          });
      }
    );
}

if (activerRecupCalendrier) {
    jsdom.env(
      urlCalendrier,
      ["http://code.jquery.com/jquery.js"],
      function (errors, window) {
          connection.connect();
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

              connection.query('select * from calendrier where equipe1 LIKE "' + equipe1 + '" AND equipe2 LIKE "' + equipe2 + '"', function (err, results) {
                  if (err) {
                      console.log('Erreur ' + err);
                      return;
                  }
                  if (results.length > 0) {
                      connection.query('UPDATE calendrier set date="' + annee+'-'+mois+'-'+jour + ' ' + heure + ':'
                              + minute + ':00' + '", score1=' + score1 + ', score2=' + score2 + ' WHERE equipe1 LIKE "' + equipe1 + '" AND equipe2 LIKE "' + equipe2 + '"',
                          function (errors, resultats) {
                              if (errors) {
                                  console.log('Erreur de mise a jour');
                                  if (--nbLines == 0) {
                                      connection.end();
                                  }
                                  return;
                              }
                              console.log('Mise a jour OK');
                              if (--nbLines == 0) {
                                  connection.end();
                                  return;
                              }
                          }
                      );
                  } else {
                      connection.query('insert into calendrier (date,equipe1,equipe2,score1,score2) VALUES ("' + annee+'-'+mois+'-'+jour + ' ' + heure + ':'
                              + minute + ':00' + '","' + equipe1 + '","' + equipe2 + '","' + score1 + '","' + score2 + '")',
                          function (errors, resultats) {
                              if (errors) {
                                  console.log('Erreur d\'insertion');
                                  console.log(errors);
                                  if (--nbLines == 0) {
                                      connection.end();
                                  }
                                  return;
                              }
                              console.log('Insertion OK');
                              if (--nbLines == 0) {
                                  connection.end();
                                  return;
                              }
                          }
                      );
                  }

              });
          });
      }
    );
}


if(activerRecupActu) {
    console.log('Doing recup actu');
    jsdom.env(urlActus, ["http://code.jquery.com/jquery.js"],function(error, window){
        console.log('Recup actu start');
        connection.connect();
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
            
            connection.query('select * from actus where postId=' + postId, function (err, results) {
                if (err) {
                    console.log('Erreur ' + err);
                    return;
                }
                if (results.length > 0) {
                    connection.query('update actus set titre="'+title.innerHTML+'", texte="'+texte+'", url="'+title.href+'", image="'+urlImage+'", date="' + annee+'-'+mois+'-'+jour + ' 00:00:00" WHERE postId='+postId, 
                            function(errors, resultats) {
                                if(errors) {
                                    console.log('Erreur de mise a jour');
                                    console.log(errors);
                                    if(--nbLines == 0) {
                                        connection.end();
                                    }
                                    return;
                                }
                                console.log('Mise à jour OK');
                                if (--nbLines == 0) {
                                    connection.end();
                                }
                            }
                    );
                } else {
                    connection.query('insert into actus (postId, titre, texte, url, image, date) VALUES (' + postId + ',"'+title.innerHTML+'","' + texte + '","' + title.href + '","' + urlImage + '","' + annee+'-'+mois+'-'+jour + ' 00:00:00")', 
                            function(errors, resultats) {
                                if(errors) {
                                    console.log('Erreur d\'insertion');
                                    console.log(errors);
                                    if(--nbLines == 0) {
                                        connection.end();
                                    }
                                    return;
                                }
                                console.log('Insertion OK');
                                if (--nbLines == 0) {
                                    connection.end();
                                }
                            }
                    );
                }
            });
        });
    });
}

