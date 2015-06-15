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
        creation_table_calendrier_query: "CREATE TABLE IF NOT EXISTS calendrier (id serial PRIMARY KEY, equipe1 varchar(255) NOT NULL, score1 integer, equipe2 varchar(255) NOT NULL, score2 integer, date timestamp without time zone DEFAULT NULL)",
        creation_table_actus_query: "CREATE TABLE IF NOT EXISTS actus (id serial PRIMARY KEY, postId NUMERIC(11) DEFAULT NULL, titre varchar(255) DEFAULT NULL, texte text, url varchar(255) DEFAULT NULL, image varchar(255) DEFAULT NULL, date date DEFAULT NULL)",
        creation_table_notification_query: "CREATE TABLE IF NOT EXISTS notification_client (id serial PRIMARY KEY , uuid varchar(255) NOT NULL, notification_id varchar(255) NOT NULL)"
    }
}

export = Constants;