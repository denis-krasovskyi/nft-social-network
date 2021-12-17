import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Comment } from 'src/comments/entities/comment.entity';

export const databaseMongo = registerAs(
  `database-mongo`,
  (): TypeOrmModuleOptions => ({
    type: 'mongodb',
    host: process.env.MONGO_DATABASE_HOST,
    port: parseInt(process.env.MONGO_DATABASE_PORT, 10),
    database: process.env.MONGO_DATABASE_NAME,
    username: process.env.MONGO_DATABASE_USERNAME,
    password: process.env.MONGO_DATABASE_PASSWORD,
    entities: [Comment],
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
  }),
);
