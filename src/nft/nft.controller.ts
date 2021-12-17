import { Controller, Get, Query } from '@nestjs/common';
import { NftQuery } from './dto/nft-query.dto';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get()
  findAll(@Query() query: NftQuery) {
    return this.nftService.getAll(query);
  }
}
