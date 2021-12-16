import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration, ConfigValidationSchema } from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { Neo4jConfig } from './neo4j/neo4j-config.interface';
import { Neo4jModule } from './neo4j/neo4j.module';

import { NearIndexerModule } from './near-indexer/near-indexer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      validationSchema: ConfigValidationSchema,
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.uri'),
      }),
      inject: [ConfigService],
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
    NearIndexerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
