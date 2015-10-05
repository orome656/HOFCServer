HOFCServer
==========

Server Tools for HOFC app

Request Informations from multiples websites:

    * http://www.fff.fr/
    * http://district-foot-65.fff.fr/
    * http://www.hofc.fr/

Multiples request are possibles : 

    * /calendrier/:equipe     : Used to get team calendar for team in parameter (equipe1, equipe2 or equipe3)
    * /classement/:equipe     : Used to get team rank for team in parameter (equipe1, equipe2 or equipe3)
    * /actus                  : Used to get news list
    * /agenda/:semaine        : Used to get club calendar for the week (week: YYYY-MM-DD)
    * /matchInfos/:id         : Used to get match informations with id. (Location, referes)
    * /parsePage              : Used to get actuality page content (Page URL in post parameter)
    * /registerPush           : Used to register to push notifications
    * /journee/:categorie/:id : Used to get informations about one matchday of one league (league: equipe1 or equipe2 or equipe3)
    * /params                 : Used to get application params