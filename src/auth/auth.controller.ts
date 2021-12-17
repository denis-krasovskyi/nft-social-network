import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  InstagramAuthResult,
  UseInstagramAuth,
} from '@nestjs-hybrid-auth/instagram';

import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.quard';
import { AccountAccessGuard } from './guards/account.guard';
import { ConnectWalletDto } from './dto/connect-wallet.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AccountAccessGuard)
  @Post('near/login')
  async loginWithNear(@Body() body: ConnectWalletDto): Promise<string> {
    return this.authService.loginWithNearWallet(body.accountId);
  }

  @UseGuards(AccountAccessGuard, JwtAuthGuard)
  @Post('near/connect-wallet')
  async connectNearWallet(
    @Request() req,
    @Body() body: ConnectWalletDto,
  ): Promise<boolean> {
    return this.authService.connectNearWallet(req.user.userId, body.accountId);
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
