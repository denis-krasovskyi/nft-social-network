import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration, ConfigValidationSchema } from './config';
import { Neo4jConfig } from './neo4j/neo4j-config.interface';
import { Neo4jModule } from './neo4j/neo4j.module';
import { InstagramAuthModule } from '@nestjs-hybrid-auth/instagram';

import { AuthModule } from './auth/auth.module';
import { NearIndexerModule } from './near-indexer/near-indexer.module';
import { NearApiModule } from './near-api/near-api.module';
import { NftModule } from './nft/nft.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm-config.service';
import { UserModule } from './user/user.module';
import { CommentsModule } from './comments/comments.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      validationSchema: ConfigValidationSchema,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Neo4jConfig => ({
        scheme: configService.get('neo4j.scheme'),
        host: configService.get('neo4j.host'),
        port: configService.get('neo4j.port'),
        username: configService.get('neo4j.username'),
        password: configService.get('neo4j.password'),
        database: configService.get('neo4j.database'),
      }),
    }),
    InstagramAuthModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        clientID: configService.get('instagram.clientID'),
        clientSecret: configService.get('instagram.clientSecret'),
        callbackURL: configService.get('instagram.callbackURL'),
      }),
    }),
    NearIndexerModule,
    NearApiModule,
    AuthModule,
    NftModule,
    UserModule,
    CommentsModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
