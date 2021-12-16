import { app } from './app';
import { mongo } from './mongo';
import { databaseNearIndexer } from './database-near-indexer';

export { ConfigValidationSchema } from './validation/schema';
export const configuration = [app, mongo, databaseNearIndexer];
