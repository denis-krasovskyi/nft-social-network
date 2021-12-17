import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { NftService } from './nft.service';

@Injectable()
export class NftAggregatorService {
  isInProgress: boolean;

  constructor(
    private nftService: NftService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    schedulerRegistry.addInterval(
      'polling',
      setInterval(() => this.aggregateUpdates(), 30000),
    );
  }

  async aggregateUpdates() {
    if (this.isInProgress) {
      return;
    }

    this.isInProgress = true;

    // aggregation

    this.isInProgress = false;
  }

  async aggregateAll() {
    if (this.isInProgress) {
      return;
    }

    this.isInProgress = true;

    // aggregation

    this.isInProgress = false;
  }
}
