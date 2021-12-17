import { app } from './app';
import { instagram } from './instagram';
import { mongo } from './mongo';
import { databaseNearIndexer } from './database-near-indexer';
import { neo4j } from './neo4j';
import { near } from './near';
import { databaseMongo } from './database-mongo';

export { ConfigValidationSchema } from './validation/schema';

export const configuration = [
  app,
  mongo,
  databaseNearIndexer,
  databaseMongo,
  neo4j,
  near,
  instagram,
];
