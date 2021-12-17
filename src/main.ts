import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Neo4jErrorFilter } from './neo4j/neo4j-error.filter';

async function bootstrap() {
  const logger = new Logger('App');

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const { port } = configService.get('app');

  app.useGlobalPipes(new ValidationPipe());
  // Commented due to error with undefined Result,Node, Relationship, in neo4j-driver module
  // app.useGlobalInterceptors(new Neo4jTypeInterceptor());
  app.useGlobalFilters(new Neo4jErrorFilter());
  app.enableCors();

  await app.listen(port, () => logger.log('API Service is listening...'));
}
bootstrap();
