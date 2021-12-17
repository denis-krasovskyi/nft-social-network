import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Comment } from 'src/comments/entities/comment.entity';
import { Nft } from 'src/nft/entities/nft.entity';
import { NftContract } from 'src/nft/entities/nft-contract.entity';
import { NftEvent } from 'src/nft/entities/nft-event.enity';
import { User } from 'src/user/entities/user.entity';

export const databaseMongo = registerAs(
  `database-mongo`,
  (): TypeOrmModuleOptions => ({
    type: 'mongodb',
    url: process.env.MONGODB_URI,
    // host: process.env.MONGO_DATABASE_HOST,
    // port: parseInt(process.env.MONGO_DATABASE_PORT, 10),
    // database: process.env.MONGO_DATABASE_NAME,
    // username: process.env.MONGO_DATABASE_USERNAME,
    // password: process.env.MONGO_DATABASE_PASSWORD,
    entities: [Comment, User, Nft, NftContract, NftEvent],
    synchronize: false,
  }),
);
