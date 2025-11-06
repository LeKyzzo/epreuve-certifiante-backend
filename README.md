# StockLink Pro 

## Résumé
API Node.js / TypeScript pour gérer les entrepôts StockLink, les produits et mouvements sont stockés dans PostgreSQL, tandis que les localisations sont conservées dans MongoDB.

## Prérequis
- Node.js 20+
- npm 10+
- PostgreSQL 14+
- MongoDB 6+

## Lancement rapide
```
npm install
cp .env.example .env
npm run dev
```
Complétez ensuite `.env` avec vos accès PostgreSQL/MongoDB.

## Clé JWT
- `JWT_SECRET` : test 
- Pour générer une clé forte :
  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Durée par défaut : `JWT_EXPIRES_IN=1h` (modifiable dans `.env`).

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

## Routes & protection
- `GET /api/products` : public
- `POST /api/products` : authentifié
- `PUT /api/products/:id` : authentifié
- `DELETE /api/products/:id` : admin uniquement
- `POST /api/movements` : authentifié
- `GET /api/movements` : public
- `GET /api/warehouses` : public
- `POST /api/warehouses` : authentifié
- `GET /api/warehouses/:id/locations` : public
- `POST /api/warehouses/:id/locations` : authentifié
- `PUT /api/warehouses/:id/locations` : authentifié

## Tests
- `npm test`

## Swagger
- Interface disponible sur `http://localhost:3000/docs`

