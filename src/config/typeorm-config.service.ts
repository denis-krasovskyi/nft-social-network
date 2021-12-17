import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(name = 'database-mongo'): TypeOrmModuleOptions {
    const {
      type,
      host,
      port,
      username,
      password,
      database,
      entities,
      synchronize,
      migrationsTableName,
      migrations,
      cli,
      namingStrategy,
    } = this.configService.get(name);

    console.log('host is ${host}')
    console.log('username is ${username}')
    console.log('database is ${database}')

    return {
      name,
      type,
      host,
      port,
      username,
      password,
      database,
      entities,
      synchronize,
      migrationsTableName,
      migrations,
      cli,
      namingStrategy,
    };
  }
}
