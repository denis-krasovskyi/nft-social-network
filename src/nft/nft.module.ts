import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

import { Nft, NftSchema } from 'src/nft/schemas/nft.schema';
import {
  NftContract,
  NftContractSchema,
} from 'src/nft/schemas/nft-contract.schema';
import { NftEvent, NftEventSchema } from 'src/nft/schemas/nft-event.schema';
import { NearIndexerModule } from 'src/near-indexer/near-indexer.module';
import { NearApiModule } from 'src/near-api/near-api.module';

import { NftService } from './nft.service';
import { NftAggregatorService } from './nft-aggregator.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Nft.name, schema: NftSchema },
      { name: NftContract.name, schema: NftContractSchema },
      { name: NftEvent.name, schema: NftEventSchema },
    ]),
    ScheduleModule.forRoot(),
    NearIndexerModule,
    NearApiModule,
    HttpModule,
  ],
  providers: [NftService, NftAggregatorService],
  exports: [NftService, NftAggregatorService],
})
export class NftModule {}
