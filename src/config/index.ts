import { app } from './app';
import { mongo } from './mongo';
import { neo4j } from './neo4j';

export { ConfigValidationSchema } from './validation/schema';
export const configuration = [app, mongo, neo4j];
