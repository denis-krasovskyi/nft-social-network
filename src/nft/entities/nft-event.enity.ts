import { Column, Entity } from 'typeorm';
import { NftEventKind } from 'src/near-indexer/types/nft-event-kind';
import { BaseEntity } from 'src/common/base.entity';

@Entity()
export class NftEvent extends BaseEntity {
  @Column()
  receiptId: string;

  @Column()
  contract: string;

  @Column()
  tokenId: string;

  @Column()
  tokenOldOwnerAccountId: string;

  @Column()
  tokenNewOwnerAccountId: string;

  @Column()
  timestamp: number;

  @Column()
  type: NftEventKind;
}
