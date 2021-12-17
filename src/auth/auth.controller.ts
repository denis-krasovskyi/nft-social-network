import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  InstagramAuthResult,
  UseInstagramAuth,
} from '@nestjs-hybrid-auth/instagram';

import { UserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { AccountAccessGuard } from './guards/account.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO: Rework with wallet callback
  @UseGuards(AccountAccessGuard)
  @Get('near')
  async loginWithNear(@Request() req): Promise<UserDto> {
    return this.authService.loginWithNear(req.near.accountId);
  }

  @UseInstagramAuth()
  @Get('instagram')
  loginWithInstagram() {
    return 'Login with Instagram';
  }

  @UseInstagramAuth()
  @Get('instagram/callback')
  instagramCallback(@Request() req): Partial<InstagramAuthResult> {
    const result: InstagramAuthResult = req.hybridAuthResult;

    // TODO: save to database and link with near account
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      profile: result.profile,
    };
  }
}
