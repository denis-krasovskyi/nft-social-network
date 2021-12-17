import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { NearIndexerModule } from 'src/near-indexer/near-indexer.module';
import { NearApiModule } from 'src/near-api/near-api.module';

import { NftService } from './nft.service';
import { NftAggregatorService } from './nft-aggregator.service';
import { Nft } from './entities/nft.entity';
import { NftContract } from './entities/nft-contract.entity';
import { UserModule } from 'src/user/user.module';
import { NftController } from './nft.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nft, NftContract]),
    ScheduleModule.forRoot(),
    NearIndexerModule,
    NearApiModule,
    HttpModule,
    UserModule,
  ],
  controllers: [NftController],
  providers: [NftService, NftAggregatorService],
  exports: [NftService, NftAggregatorService],
})
export class NftModule {}
