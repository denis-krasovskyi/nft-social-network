import * as Joi from 'joi';

export const ConfigValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),

  MONGODB_URI: Joi.string().required(),
  NEAR_INDEXER_DATABASE_HOST: Joi.string().required(),
  NEAR_INDEXER_DATABASE_PORT: Joi.number().required(),
  NEAR_INDEXER_DATABASE_NAME: Joi.string().required(),
  NEAR_INDEXER_DATABASE_USERNAME: Joi.string().required(),
  NEAR_INDEXER_DATABASE_PASSWORD: Joi.string().required(),

  NEAR_NETWORK_ID: Joi.string().required(),
  NEAR_NODE_URL: Joi.string().required(),
  NEAR_WALLET_URL: Joi.string().required(),
  NEAR_HELPER_URL: Joi.string().required(),
  NEAR_EXPLORER_URL: Joi.string().required(),
  NEAR_PROVIDER_URL: Joi.string().required(),

  NEO4J_SCHEME: Joi.string().default('neo4j'),
  NEO4J_HOST: Joi.string().required(),
  NEO4J_PORT: Joi.number().default(7687),
  NEO4J_USERNAME: Joi.string().required(),
  NEO4J_PASSWORD: Joi.string().required(),
  NEO4J_DATABASE: Joi.string(),

  INSTAGRAM_CLIENT_ID: Joi.string().required(),
  INSTAGRAM_CLIENT_SECRET: Joi.string().required(),
  INSTAGRAM_CALLBACK_URL: Joi.string().required(),
});
