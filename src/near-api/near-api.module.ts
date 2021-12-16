import { Module } from '@nestjs/common';

import { NearApiService } from './near-api.service';
import { nearApiProvider } from './near-api.provider';

@Module({
  imports: [],
  providers: [nearApiProvider, NearApiService],
  exports: [nearApiProvider, NearApiService],
})
export class NearApiModule {}
