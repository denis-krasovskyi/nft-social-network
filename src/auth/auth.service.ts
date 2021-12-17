import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { NftService } from 'src/nft/nft.service';
import { NearApiService } from 'src/near-api/near-api.service';
import { UserDocument } from 'src/user/schemas/user.schema';

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
      user = await this.userService.create({ nearAccounts: [accountId] });
      await this.nftService.loadAllAccountNfts(accountId);
    }

    return this.generateJwt(user);
  }

  async connectNearWallet(userId: string, accountId: string) {
    const user = await this.userService.findByNearAccount(accountId);

    if (!user) {
      await this.userService.addNearAccount(userId, accountId);
      await this.nftService.loadAllAccountNfts(accountId);
    }

    return true;
  }

  private generateJwt(user: UserDocument): string {
    return this.jwtService.sign({ userId: user._id });
  }
}
