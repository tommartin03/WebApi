# M1 Informatique -- Web APIs

## Adaptation du fichier docker-compose.yml

Il faut modifier les lignes suivantes dans docker-compose.yml.

USERNAME est votre nom d'utilisateur, UID votre identifiant utilisateur: on obtient ces informations en exécutant la commande "id".

Exemple: 

args:
  USERNAME: frederic.loulergue
  UID: 11688
  MAIL: frederic.loulergue@univ-orleans.fr
  NAME: "Frédéric Loulergue"

Il est également conseillé de personnaliser le nom du container. Dans cette version (voir docker-compose.yml), j'ai appelé le container : container-wa-tp1-bidule

## Démarrage

L'utilisation est:
  docker-compose build
  docker-compose up -d
  docker exec -ti le_nom_choisi_du_container bash
