import { Controller, Get, Request } from '@nestjs/common';
import {
  InstagramAuthResult,
  UseInstagramAuth,
} from '@nestjs-hybrid-auth/instagram';

@Controller('auth')
export class AuthController {
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
