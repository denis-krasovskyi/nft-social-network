import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from 'src/user/user.module';
import { NearApiModule } from 'src/near-api/near-api.module';
import { NftModule } from 'src/nft/nft.module';

import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const { jwtSecret } = configService.get('app');
        return {
          secret: jwtSecret,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    NearApiModule,
    NftModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
