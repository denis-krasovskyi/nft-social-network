import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.quard';

import { UserService } from './user.service';
import { UserProfileDto } from './dto/user-profile.interface';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyUser(@Request() req): Promise<User> {
    return this.userService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my/profile')
  async updateUserProfile(
    @Request() req,
    @Body() body: UserProfileDto,
  ): Promise<boolean> {
    return this.userService.updateUserProfile(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my/near-account/:accountId/enable')
  async enableNearWallet(
    @Request() req,
    @Param('accountId') accountId: string,
  ): Promise<User> {
    return this.userService.setNearAccountStatus(
      req.user.userId,
      accountId,
      true,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my/near-account/:accountId/disable')
  async disableNearWallet(
    @Request() req,
    @Param('accountId') accountId: string,
  ): Promise<User> {
    return this.userService.setNearAccountStatus(
      req.user.userId,
      accountId,
      false,
    );
  }
}
