import { Module } from '@nestjs/common';

import { UserModule } from 'src/user/user.module';
import { NearApiModule } from 'src/near-api/near-api.module';
import { NftModule } from 'src/nft/nft.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, NearApiModule, NftModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
