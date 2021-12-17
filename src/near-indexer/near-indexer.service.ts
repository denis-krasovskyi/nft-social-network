import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { AssetsNftEvent } from './entities/assets-nft-event.entity';

@Injectable()
export class NearIndexerService {
  constructor(
    @InjectRepository(AssetsNftEvent, 'database-near-indexer')
    private readonly assetsNftEventRepository: Repository<AssetsNftEvent>,

    @InjectConnection('database-near-indexer')
    private connection: Connection,
  ) {}

  findLastNftEvents(fromBlockTimestamp: number): Promise<AssetsNftEvent[]> {
    return this.assetsNftEventRepository
      .createQueryBuilder('event')
      .where('event.emitted_at_block_timestamp >= :from', {
        from: fromBlockTimestamp,
      })
      .getMany();
  }

  findNftEventsByAccountId(
    accountId: string,
    fromBlockTimestamp?: number,
  ): Promise<AssetsNftEvent[]> {
    const queryBuilder = this.assetsNftEventRepository
      .createQueryBuilder('event')
      .where('event.token_new_owner_account_id = :accountId', {
        accountId,
      });

    if (fromBlockTimestamp) {
      queryBuilder.andWhere('event.emitted_at_block_timestamp >= :from', {
        from: fromBlockTimestamp,
      });
    }

    return queryBuilder.getMany();
  }

  async findLikelyNFTs(accountId: string): Promise<string[]> {
    const received = `
        select distinct receipt_receiver_account_id as receiver_account_id
        from action_receipt_actions
        where action_kind = 'FUNCTION_CALL'
            and args->>'args_json' is not null
            and args->'args_json'->>'receiver_id' = $1
            and args->>'method_name' like 'nft_%'
    `;
    const batched = `
        select distinct receipt_receiver_account_id as receiver_account_id
        from action_receipt_actions
        where action_kind = 'FUNCTION_CALL'
            and args->>'args_json' is not null
            and args->>'method_name' = 'nft_batch_mint'
            and args->'args_json'->>'owner_id' = $1
    `;
    const events = `
        select distinct emitted_by_contract_account_id as receiver_account_id
        from assets__non_fungible_token_events
        where token_new_owner_account_id = $1
    `;

    const receivedTokens = await this.connection.query(received, [accountId]);
    const batchedTokens = await this.connection.query(batched, [accountId]);
    const eventTokens = await this.connection.query(events, [accountId]);

    return [
      ...new Set(
        [...receivedTokens, ...batchedTokens, ...eventTokens].map(
          ({ receiver_account_id }) => receiver_account_id,
        ),
      ),
    ];
  }
}
