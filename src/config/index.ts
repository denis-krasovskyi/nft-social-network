import { app } from './app';
import { instagram } from './instagram';
import { mongo } from './mongo';
import { databaseNearIndexer } from './database-near-indexer';
import { neo4j } from './neo4j';
import { near } from './near';

export { ConfigValidationSchema } from './validation/schema';

export const configuration = [
  app,
  mongo,
  databaseNearIndexer,
  neo4j,
  near,
  instagram,
];
