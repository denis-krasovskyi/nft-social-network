import * as Joi from 'joi';

export const ConfigValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  MONGODB_URI: Joi.string().required(),
  NEAR_INDEXER_DATABASE_HOST: Joi.string().required(),
  NEAR_INDEXER_DATABASE_PORT: Joi.number().required(),
  NEAR_INDEXER_DATABASE_NAME: Joi.string().required(),
  NEAR_INDEXER_DATABASE_USERNAME: Joi.string().required(),
  NEAR_INDEXER_DATABASE_PASSWORD: Joi.string().required(),
  NEO4J_SCHEME: Joi.string().default('neo4j'),
  NEO4J_HOST: Joi.string().required(),
  NEO4J_PORT: Joi.number().default(7687),
  NEO4J_USERNAME: Joi.string().required(),
  NEO4J_PASSWORD: Joi.string().required(),
  NEO4J_DATABASE: Joi.string().required(),
});
