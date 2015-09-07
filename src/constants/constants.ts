/**
 * Contient l'ensemble des constantes communes a l'application
 */
/*jslint node: true */

var HOFC_NAME = 'HORGUES ODOS F.C.';

/**
 *	Tableau permettant de convertir la chaine date récupérée en objet date
 */
var listeMois = {
        "JANVIER": "01",
        "FÉVRIER": "02",
        "MARS": "03",
        "AVRIL": "04",
        "MAI": "05",
        "JUIN": "06",
        "JUILLET": "07",
        "AOUT": "08",
        "SEPTEMBRE": "09",
        "OCTOBRE": "10",
        "NOVEMBRE": "11",
        "DÉCEMBRE": "12"
    };

/**
 *	Tableau permettant de convertir la chaine date récupérée en objet date pour les actus
 */
var listeMoisActu = {
        "janvier": "01",
        "février": "02",
        "mars": "03",
        "avril": "04",
        "mai": "05",
        "juin": "06",
        "juillet": "07",
        "août": "08",
        "septembre": "09",
        "octobre": "10",
        "novembre": "11",
        "décembre": "12"
    };
    
/**
 *	Tableau permettant de convertir la chaine date récupérée en objet date pour les match du site du district
 */
var listeMoisDistrict = {
    "janvier": "01",
    "fevrier": "02",
    "mars": "03",
    "avril": "04",
    "mai": "05",
    "juin": "06",
    "juillet": "07",
    "aout": "08",
    "septembre": "09",
    "octobre": "10",
    "novembre": "11",
    "decembre": "12"
};
module Constants {
    export var errorCode =  {
        OK: 0,
        BACKEND:-1,
        UNKNOWN:-2,
        INTERNAL:-3,
        CALLING_PROBLEM: 1
    }
    export var params = {
        SEASON_MATCHS_COUNT: 22
    }
    export var constants = {
        HOFC_NAME: HOFC_NAME,
        listeMois: listeMois,
        listeMoisActu: listeMoisActu,
        listeMoisDistrict: listeMoisDistrict
    }
    export var database = {
        creation_table_classement_query: "CREATE TABLE IF NOT EXISTS classement (id serial PRIMARY KEY , nom varchar(255) NOT NULL, points NUMERIC(11) NOT NULL, joue NUMERIC(11) NOT NULL, gagne NUMERIC(11) NOT NULL, nul NUMERIC(11) NOT NULL, perdu NUMERIC(11) NOT NULL, bp NUMERIC(11) NOT NULL, bc NUMERIC(11) NOT NULL, diff NUMERIC(11) NOT NULL)",
        creation_table_calendrier_query: "CREATE TABLE IF NOT EXISTS calendrier (id serial PRIMARY KEY, equipe1 varchar(255) NOT NULL, score1 integer, equipe2 varchar(255) NOT NULL, score2 integer, date timestamp without time zone DEFAULT NULL, categorie varchar(50))",
        creation_table_actus_query: "CREATE TABLE IF NOT EXISTS actus (id serial PRIMARY KEY, postId NUMERIC(11) DEFAULT NULL, titre varchar(255) DEFAULT NULL, texte text, url varchar(255) DEFAULT NULL, image varchar(255) DEFAULT NULL, date date DEFAULT NULL)",
        creation_table_notification_query: "CREATE TABLE IF NOT EXISTS notification_client (id serial PRIMARY KEY , uuid varchar(255) NOT NULL, notification_id varchar(255) NOT NULL)",
        creation_table_agenda_query: "CREATE TABLE IF NOT EXISTS agenda (id serial PRIMARY KEY, equipe1 varchar(255) NOT NULL, score1 integer, equipe2 varchar(255) NOT NULL, score2 integer, date timestamp without time zone DEFAULT NULL, id_date varchar(50) NOT NULL)",
        creation_table_journee_query: "CREATE TABLE IF NOT EXISTS journee (id serial PRIMARY KEY, equipe1 varchar(255) NOT NULL, score1 integer, equipe2 varchar(255) NOT NULL, score2 integer, date timestamp without time zone DEFAULT NULL, id_journee integer, infos varchar(50))",
        classement: {column_id: {name:'id', type:'serial'}, 
                     column_nom: {name: 'nom', type: 'varchar(255)'},
                     column_points: {name: 'points', type: 'NUMERIC(11)'},
                     column_joue: {name: 'joue', type: 'NUMERIC(11)'},
                     column_gagne: {name: 'gagne', type: 'NUMERIC(11)'},
                     column_nul: {name: 'nul', type: 'NUMERIC(11)'},
                     column_perdu: {name: 'perdu', type: 'NUMERIC(11)'},
                     column_bp: {name: 'bp', type: 'NUMERIC(11)'},
                     column_bc: {name: 'bc', type: 'NUMERIC(11)'},
                     column_diff: {name: 'diff', type: 'NUMERIC(11)'}},
        calendrier: {column_id: {name:'id', type:'serial'}, 
                     column_equipe1: {name: 'equipe1', type: 'varchar(255)'},
                     column_equipe2: {name: 'equipe2', type: 'varchar(255)'},
                     column_score1: {name: 'score1', type: 'integer'},
                     column_score2: {name: 'score2', type: 'integer'},
                     column_date: {name: 'date', type: 'timestamp without time zone'}},
        actus:      {column_id: {name:'id', type:'serial'}, 
                     column_post_id: {name: 'postId', type: 'NUMERIC(11)'},
                     column_titre: {name: 'titre', type: 'varchar(255)'},
                     column_texte: {name: 'texte', type: 'integer'},
                     column_url: {name: 'url', type: 'varchar(255)'},
                     column_image: {name: 'image', type: 'varchar(255)'},
                     column_date: {name: 'date', type: 'date'}}
    }
}

export = Constants;