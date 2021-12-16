import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration, ConfigValidationSchema } from './config';
import { MongooseModule } from '@nestjs/mongoose';

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
    NearIndexerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
