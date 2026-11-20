# CineTrack-V2

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MockAPI](https://img.shields.io/badge/MockAPI-REST_API-009688?style=for-the-badge)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

---

## Démo en Ligne

[Lien Vercel](https://cinetrack-v2-lilac.vercel.app)

---

## Planification de brief

[Planification Jira](https://nidalbary.atlassian.net/jira/software/projects/CV/boards/36?filter=&groupBy=none&atlOrigin=eyJpIjoiZmFkZTZmN2M0YWMzNGJkNmFmNjY2OTBmNjUwMjZiMzEiLCJwIjoiaiJ9)

---

## Présentation du Projet

**CineTrack** est une application web moderne et responsive de gestion de catalogue de films et séries connectée à une API REST (**MockAPI**). Elle permet aux utilisateurs d'explorer un catalogue multimédia en ligne, de filtrer et rechercher des œuvres en temps réel, de consulter les fiches détaillées avec un espace de commentaires, de gérer leurs favoris et d'administrer le catalogue complet via une interface CRUD dédiée.

### Fonctionnalités Principales

* **Catalogue Dynamique & Pagination** : Affichage des films et séries récupérés depuis MockAPI sous forme de cartes interactives avec navigation par pages (`Prev` / `Next`).
* **Recherche & Filtrage Instantané** : Barre de recherche par titre combinée à un filtre par catégorie (`Tous`, `Movies`, `Series`).
* **Modale de Détails & Commentaires** : Aperçu complet au clic sur une carte (affiche, synopsis, année de sortie, durée ou nombre de saisons, genres, réalisateurs, pays de production) accompagné d'un système de commentaires persistants via l'API (`GET` / `POST`) et sauvegarde automatique du pseudo dans le `localStorage`.
* **Espace Administration (CRUD Complet)** : Page dédiée (`admin.html`) permettant d'ajouter (`POST`), modifier (`PUT`) et supprimer (`DELETE`) des films et séries avec validation complète du formulaire, aperçu d'image en direct et tableau responsive mobile-first.
* **Système de Favoris Persistant** : Ajout et suppression de favoris sauvegardés dans le `localStorage`, avec compteur automatique de films et séries.

---

## Technologies

* **HTML5** (Structure sémantique multi-pages : `index.html` & `admin.html`)
* **Tailwind CSS** (Design responsive Mobile-First)
* **JavaScript ES6+** (Modules ES, `fetch` / `async-await`, manipulation du DOM, validation de formulaires, `localStorage`)
* **MockAPI** (Backend RESTful pour la persistance des données)
* **Git & GitHub / Vercel** (Gestion de versions et déploiement continu)

---

## Structure des Fichiers

```text
├── index.html          # Page principale : catalogue, recherche, filtres, modale avec commentaires et favoris
├── admin.html          # Interface d'administration : formulaire ajout/modification et tableau CRUD
├── README.md           # Documentation du projet et des endpoints API
└── js/
    ├── api.js          # Centralisation des appels HTTP (GET, POST, PUT, DELETE) vers MockAPI
    ├── dom.js          # Génération dynamique du DOM (cartes, modale, commentaires, tableau admin, alertes)
    ├── validation.js   # Validation des champs du formulaire d'administration
    ├── main.js         # Logique du catalogue, filtres, pagination, favoris et gestion des commentaires
    └── admin.js        # Logique CRUD de la page d'administration
