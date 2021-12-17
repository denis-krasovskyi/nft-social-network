import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.quard';
import {
  PaginationRequest,
  PaginationResponse,
} from 'src/common/pagination.interface';
import { NftService } from './nft.service';
import { Nft } from './entities/nft.entity';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('popular')
  async getPopularNfts(
    @Query() query: PaginationRequest,
  ): Promise<PaginationResponse<Nft>> {
    return this.nftService.getPopularNfts(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyNfts(
    @Request() req,
    @Query() query: PaginationRequest,
  ): Promise<PaginationResponse<Nft>> {
    return this.nftService.getUserNfts(req.user.userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('my/show-list')
  async showNfts(@Request() req, @Body() nftIds: string[]): Promise<Nft[]> {
    return this.nftService.setNftsVisible(req.user.userId, nftIds, true);
  }

  @UseGuards(JwtAuthGuard)
  @Post('my/hide-list')
  async hideNfts(@Request() req, @Body() nftIds: string[]): Promise<Nft[]> {
    return this.nftService.setNftsVisible(req.user.userId, nftIds, false);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my/:nftId/show')
  async showNft(@Request() req, @Param('nftId') nftId: string): Promise<Nft> {
    return this.nftService.setNftVisible(req.user.userId, nftId, true);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my/:nftId/hide')
  async hideNft(@Request() req, @Param('nftId') nftId: string): Promise<Nft> {
    return this.nftService.setNftVisible(req.user.userId, nftId, false);
  }
}
