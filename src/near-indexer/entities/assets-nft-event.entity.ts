import { Entity, PrimaryColumn } from 'typeorm';
import { NftEventKind } from '../types/nft-event-kind';

@Entity({ name: 'assets__non_fungible_token_events' })
export class AssetsNftEvent {
  @PrimaryColumn()
  emittedForReceiptId: string;

  @PrimaryColumn({ type: 'bigint' })
  emittedAtBlockTimestamp: number;

  @PrimaryColumn({ type: 'bigint' })
  emittedInShardId: number;

  @PrimaryColumn()
  emittedIndexOfEventEntryInShard: number;

  @PrimaryColumn()
  emittedByContractAccountId: string;

  @PrimaryColumn()
  tokenId: string;

  @PrimaryColumn({
    type: 'enum',
    enum: NftEventKind,
  })
  eventKind: string;

  @PrimaryColumn()
  tokenOldOwnerAccountId: string;

  @PrimaryColumn()
  tokenNewOwnerAccountId: string;

  @PrimaryColumn()
  tokenAuthorizedAccountId: string;

  @PrimaryColumn()
  eventMemo: string;
}
