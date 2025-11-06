# StockLink Core 

## Résumé
API Node.js / TypeScript pour gérer les entrepôts StockLink. Les produits et mouvements sont stockés dans PostgreSQL (pilote `pg`) tandis que la cartographie interne est conservée dans MongoDB (pilote `mongodb`)

## Prérequis
- Node.js 20+
- npm 10+
- PostgreSQL 14+
- MongoDB 6+

## Installation
```bash
npm install
cp .env.example .env
```
Adaptez ensuite le fichier `.env` avec vos paramètres locaux, cluster mongodb, db pgadmin

## Scripts npm
- `npm run dev` : lance l’API en TypeScript avec rechargement (`ts-node-dev`).
- `npm run build` : compile vers `dist/`.
- `npm run start` : exécute la version compilée.
- `npm run test` : A faire

## Structure du projet
```
src/
  app.ts                # Configuration Express et routage
  server.ts             # Démarrage serveur + connexions BDD
  bdd.ts                # Connexions PostgreSQL / MongoDB partagées
  config/
    env.ts              # Lecture des variables d’environnement
  controllers/          # Logique des endpoints REST
  routes/               # Routes Express par ressource
  types/
    location.ts         # Interfaces TypeScript pour la structure Mongo
reponses_sauvegarde.txt # Réponses théoriques à compléter
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
1. Démarrez un serveur MongoDB (par défaut `mongodb://localhost:27017/stocklink`).
2. Ajustez `MONGO_URI` dans `.env` au besoin.
3. La collection `locations` est créée automatiquement et indexée sur `warehouseId` lors de la première insertion.

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

## Notes
- A faire
