# API des Articles - Node.js & Express

**Étude de cas - Bloc 3 Bachelor CDA et Développement Web**

Par Patrick Mennechez

## Objectif du projet

Développer une API REST complète pour la gestion d'articles avec authentification, autorisation et fonctionnalités temps réel, en utilisant Node.js, Express, MongoDB et Socket.IO.

## Architecture de la base de données

### Diagramme UML

```
┌─────────────────────────────────┐
│            User                 │
├─────────────────────────────────┤
│ _id: ObjectId (PK)              │
│ name: String                    │
│ password: String (required)     │
│ email: String (required, unique)│
│ date: Date (default: Date.now)  │
│ role: String (enum)             │
│   • "admin"                     │
│   • "member"                    │
│ age: Number                     │
└─────────────────────────────────┘
                │
                │ 1
                │
                │ *
┌─────────────────────────────────┐
│           Article               │
├─────────────────────────────────┤
│ _id: ObjectId (PK)              │
│ title: String                   │
│ content: String                 │
│ status: String (enum)           │
│   • "draft"                     │
│   • "published"                 │
│ user: ObjectId (FK) → User._id  │
└─────────────────────────────────┘
```

### Relations

- **User → Article** : Relation 1:N (One-to-Many)
- Un utilisateur peut avoir plusieurs articles
- Un article appartient à un seul utilisateur

## Technologies utilisées

- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB, Mongoose
- **Authentification** : JWT (jsonwebtoken)
- **Temps réel** : Socket.IO
- **Sécurité** : bcrypt
- **Tests** : Jest, SuperTest, mockingoose
- **Déploiement** : PM2
- **Validation** : Mongoose validators

## Fonctionnalités développées

### 1. Énumération des statuts d'articles

- Ajout de l'énumération `status` avec les valeurs "draft" et "published"
- Valeur par défaut : "draft"
- Validation automatique avec messages d'erreur personnalisés

### 2. API CRUD pour les articles

**Endpoints créés :**

- `POST /api/articles` - Créer un article (utilisateur connecté)
- `PUT /api/articles/:id` - Modifier un article (admin uniquement)
- `DELETE /api/articles/:id` - Supprimer un article (admin uniquement)

**Contraintes implémentées :**

- Authentification obligatoire pour toutes les opérations
- Restriction admin pour modification/suppression
- Liaison automatique article-utilisateur lors de la création
- Intégration Socket.IO pour le temps réel
- Validation des données avec énumération status

### 3. Endpoint public pour les articles par utilisateur

- `GET /api/users/:userId/articles` - Récupérer les articles d'un utilisateur (public)
- Population automatique des informations utilisateur
- Exclusion du mot de passe dans les données retournées
- Aucune authentification requise

### 4. Tests unitaires

- 7 tests réussis pour les opérations CRUD
- Utilisation de SuperTest et mockingoose
- Mock du middleware d'authentification
- Validation des codes de réponse HTTP
- Vérification des données retournées

### 5. Configuration de déploiement PM2

- 3 instances en parallèle (mode cluster)
- Limite mémoire : 200 Mo par instance
- Logs d'erreur : `./logs/err.log`
- Logs de sortie : `./logs/out.log`

## Structure du projet

```
nodejs-approfondissement/
├── api/
│   ├── users/
│   │   ├── users.model.js
│   │   ├── users.service.js
│   │   ├── users.controller.js
│   │   └── users.router.js
│   └── articles/
│       ├── articles.schema.js
│       ├── articles.service.js
│       ├── articles.controller.js
│       └── articles.router.js
├── config/
│   └── index.js
├── middlewares/
│   └── auth.js
├── tests/
│   ├── users.spec.js
│   └── articles.spec.js
├── logs/
├── server.js
├── ecosystem.config.js
└── package.json
```

## Installation et configuration

### Prérequis

- Node.js (v14+)
- MongoDB
- PM2 (optionnel)

### Installation

```bash
git clone https://github.com/Daldeb/Etude-de-cas-API-des-articles---Bloc-3-Bachelor-CDA-et-Dev-web.git
cd Nodejs-Approfondissement
npm install
```

### Configuration de MongoDB

**macOS avec Homebrew :**
```bash
brew services start mongodb/brew/mongodb-community
```

**Ubuntu/Linux :**
```bash
sudo systemctl start mongodb
```

### Lancement de l'application

**Mode développement :**
```bash
npm run serve
```

**Mode production avec PM2 :**
```bash
pm2 start ecosystem.config.js
pm2 list
pm2 logs
```

### Exécution des tests

```bash
npm test
```

## Guide d'utilisation

### Authentification

**Créer un utilisateur admin :**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"motdepasse123","role":"admin"}'
```

**Se connecter :**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"motdepasse123"}'
```

### Gestion des articles

**Créer un article :**
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -H "x-access-token: YOUR_TOKEN" \
  -d '{"title":"Mon article","content":"Contenu de l'\''article","status":"published"}'
```

**Modifier un article (admin uniquement) :**
```bash
curl -X PUT http://localhost:3000/api/articles/ARTICLE_ID \
  -H "Content-Type: application/json" \
  -H "x-access-token: YOUR_TOKEN" \
  -d '{"title":"Article modifié","status":"published"}'
```

**Supprimer un article (admin uniquement) :**
```bash
curl -X DELETE http://localhost:3000/api/articles/ARTICLE_ID \
  -H "x-access-token: YOUR_TOKEN"
```

**Récupérer les articles d'un utilisateur (public) :**
```bash
curl -X GET http://localhost:3000/api/users/USER_ID/articles
```

## Monitoring et déploiement

### Commandes PM2

**Gestion des processus :**
```bash
pm2 list                    # Liste des processus
pm2 show app               # Détails d'un processus
pm2 restart all            # Redémarrer tous les processus
pm2 stop all               # Arrêter tous les processus
pm2 delete all             # Supprimer tous les processus
```

**Monitoring :**
```bash
pm2 monit                  # Interface de monitoring
pm2 logs                   # Afficher les logs
pm2 logs --lines 50        # Afficher les 50 dernières lignes
```

## Configuration

La configuration se trouve dans `config/index.js` :

```javascript
module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: "mongodb://localhost:27017/myapp",
  secretJwtToken: "test",
};
```

## Architecture REST

L'API suit les principes REST avec :

- Codes de statut HTTP appropriés
- Structure d'URLs cohérente
- Séparation claire des responsabilités (MVC)
- Middleware d'authentification modulaire
- Gestion d'erreurs centralisée

## Tests et validation

### Résultats des tests

- Tests de création d'article : PASS
- Tests de modification d'article : PASS
- Tests de suppression d'article : PASS
- Tests d'authentification : PASS
- Tests de validation des données : PASS
- Tests des méthodes de service : PASS
- Tests de population des données : PASS

### Couverture fonctionnelle

- Authentification et autorisation robustes
- CRUD complet pour les articles
- Temps réel avec Socket.IO
- Configuration de production PM2
- Architecture REST professionnelle

## Sécurité

### Mesures implémentées

- Authentification JWT obligatoire
- Mots de passe hachés avec bcrypt
- Validation des rôles utilisateur
- Exclusion des mots de passe dans les réponses
- Validation des données d'entrée

## Projet réalisé dans le cadre du Bloc 3 Bachelor CDA et Développement Web
