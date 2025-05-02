- code refacto pour l'affichage des memes/commentaires:
    - Splitter les responsabilités entre plusieurs composants.
    - ne pas faire des boucles for imbriqués pour chercher les données, nous avons l'endpoint getUsersByIds, à appeler une fois par slice de même, nous pourrions aussi utiliser un système de cache si nos users ne sont pas redondans, dans ce cas, ajouter dans une structure de données DATASET, avec userId -> User, et chercher dans le cache avant d'appeler le backend.


- Ajouter un système de scroll infini

- ajouter une intelligence dans le merge des autheurs avec les memes (get liste d'autheur via liste de mêmes)
- centraliser la logique de fetch de memes, mergés avec les auteurs et les commentaires dans un Custom Hook
- ne pas charger les commentaires si on n'ouvre pas la section utilisateur (faire un lazy loading maybe)

-  sauvegarder le retour de get user comme authenticated user, pour ne pas faire l'appel à chaque fois pour avoir le nom et l'image du user connecté.

- TODO: Refacto tests and improve performance (delete useless handlers ...)