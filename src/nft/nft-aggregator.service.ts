import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

import { NearIndexerService } from 'src/near-indexer/near-indexer.service';
import { FIRST_NFT_EVENT_TIMESTAMP } from 'src/common/constants';
import { UserService } from 'src/user/user.service';

import { NftService } from './nft.service';
import { NftUpdateDto } from './dto/nft-update.dto';
import { castNftEvent } from './dto/nft-event.dto';

@Injectable()
export class NftAggregatorService {
  logger = new Logger(NftAggregatorService.name);
  isInProgress: boolean;
  aggregationInterval: number;

  constructor(
    private nftService: NftService,
    private readonly nearIndexerService: NearIndexerService,
    private readonly userService: UserService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
  ) {
    const { nftAggregationInterval } = configService.get('app');
    this.aggregationInterval = nftAggregationInterval;
    this.startAggregation();
  }

  async startAggregation() {
    let isUpdatesFound;

    // Aggregate all missed updates
    do {
      isUpdatesFound = await this.aggregateUpdates();
    } while (isUpdatesFound);

    this.schedulerRegistry.addInterval(
      'polling',
      setInterval(() => this.aggregateUpdates(), this.aggregationInterval),
    );
  }

  async aggregateUpdates(): Promise<boolean> {
    if (this.isInProgress) {
      return false;
    }

    this.isInProgress = true;

    const lastSavedEvent = await this.nftService.getLastNftEvent();
    const fromTimestamp =
      lastSavedEvent?.timestamp || FIRST_NFT_EVENT_TIMESTAMP;
    const events = await this.nearIndexerService.findLastNftEvents(
      fromTimestamp,
      1000,
    );
    const lastEvent = events[events.length - 1];

    if (!lastEvent) {
      this.isInProgress = false;
      return false;
    }

    const nearAccountsMap = await this.userService
      .findAllNearAccounts()
      .then((accounts) =>
        accounts.reduce(
          (accountMap, accountId) => ({
            ...accountMap,
            [accountId]: accountId,
          }),
          {},
        ),
      );
    const nftUpdates: NftUpdateDto[] = [];

    events.forEach((event) => {
      if (nearAccountsMap[event.tokenOldOwnerAccountId]) {
        nftUpdates.push({
          contractId: event.emittedByContractAccountId,
          accountId: event.tokenOldOwnerAccountId,
        });
      }

      if (nearAccountsMap[event.tokenNewOwnerAccountId]) {
        nftUpdates.push({
          contractId: event.emittedByContractAccountId,
          accountId: event.tokenNewOwnerAccountId,
        });
      }
    });

    await this.nftService.loadAccountNftUpdates(nftUpdates);
    await this.nftService.createNftEvent(castNftEvent(lastEvent));

    nftUpdates.forEach(({ contractId, accountId }) => {
      this.logger.log(
        `Aggregated NFT update. Contract: ${contractId} Account: ${accountId}`,
      );
    });

    this.isInProgress = false;
    return true;
  }
}
