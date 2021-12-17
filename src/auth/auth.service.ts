import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { NftService } from 'src/nft/nft.service';
import { NearApiService } from 'src/near-api/near-api.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly nftService: NftService,
    private readonly nearApiService: NearApiService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithNearWallet(accountId: string): Promise<string> {
    let user = await this.userService.findByNearAccount(accountId);

    if (!user) {
      user = await this.userService.create({
        nearAccounts: [{ accountId, enabled: true }],
      });
      await this.nftService.loadAllAccountNfts(accountId);
    }

    return this.generateJwt(user);
  }

  async connectNearWallet(userId: string, accountId: string) {
    const user = await this.userService.findByNearAccount(accountId);

    if (!user) {
      await this.userService.addNearAccount(userId, {
        accountId,
        enabled: true,
      });
      await this.nftService.loadAllAccountNfts(accountId);
    }

    return true;
  }

  private generateJwt(user: User): string {
    return this.jwtService.sign({ userId: user.id });
  }
}
