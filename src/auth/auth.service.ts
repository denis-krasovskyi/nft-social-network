import { Injectable } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/user.dto';
import { NftService } from 'src/nft/nft.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly nftService: NftService,
  ) {}

  async loginWithNear(accountId: string): Promise<UserDto> {
    const userDto = { accountId };
    const user = await this.userService.findByAccount(accountId);

    if (!user) {
      await this.userService.create({ accountId });
      await this.nftService.loadAllAccountNfts(accountId);
    }

    return userDto;
  }
}
