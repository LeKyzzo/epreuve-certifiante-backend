import { MongoClient } from 'mongodb';

import env from './env';

const mongoClient = new MongoClient(env.mongo.uri);

export default mongoClient;
