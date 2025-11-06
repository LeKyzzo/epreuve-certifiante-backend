# StockLink Pro 

## Résumé
API Node.js / TypeScript pour gérer les entrepôts StockLink, les produits et mouvements sont stockés dans PostgreSQL, tandis que les localisations sont conservées dans MongoDB.

## Prérequis
- Node.js 20+
- npm 10+
- PostgreSQL 14+
- MongoDB 6+

## Installation
```
npm install
cp .env.example .env
```
Adaptez ensuite le fichier `.env` avec votre cluster mongodb et votre db pgadmin

## Scripts npm
- `npm run dev` : lance l’API en TypeScript avec rechargement (`ts-node-dev`).
- `npm run build` : compile vers `dist/`.
- `npm run start` : exécute la version compilée.
- `npm run test` : script de test à faire si j'ai le temps mdr.

## Structure du projet
```
src/
  app.ts                # Configuration Express et routes
  server.ts             # Démarrage serveur
  config/
    env.ts              # Lecture des variables d’environnement
    mongoClient.ts      # Client MongoDB partagé
    postgresClient.ts   # Pool PostgreSQL partagé
  controllers/          # Logique des endpoints
  routes/               # Routes Express
  types/
    location.ts         # Interfaces TypeScript pour la structure Mongo
reponses_sauvegarde.txt # Réponses théoriques des questions 
```

## Bases de données
### PostgreSQL
1. Créez la base `stocklink` :
  ```sql
    CREATE DATABASE stocklink;
  ```
2. Appliquez le script fourni pour créer `warehouses`, `products`, `movements`.
3. Renseignez les variables `POSTGRES_*` dans `.env`.

### MongoDB
1. Démarrez un serveur MongoDB 
2. Ajustez `MONGO_URI` dans `.env`
3. La collection `locations` est créée automatiquement et indexée sur `warehouseId`.

## Routes disponibles
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/warehouses/:id/locations`
- `POST /api/warehouses/:id/locations`
- `PUT /api/warehouses/:id/locations`
- `GET /api/locations/:binCode/exists`
- `GET /api/movements`
- `POST /api/movements`

