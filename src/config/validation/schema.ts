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
});
