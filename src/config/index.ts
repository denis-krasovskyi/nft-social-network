import { app } from './app';
import { mongo } from './mongo';
import { databaseNearIndexer } from './database-near-indexer';
import { neo4j } from './neo4j';

export { ConfigValidationSchema } from './validation/schema';
export const configuration = [app, mongo, databaseNearIndexer, neo4j];
