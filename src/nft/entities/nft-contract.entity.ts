import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';
import { Nft } from './nft.entity';

@Entity()
export class NftContract extends BaseEntity {
  @Column()
  contractId: string;

  @Column()
  name: string;

  @Column()
  spec: string;

  @Column()
  icon: string;

  @Column()
  symbol: string;

  @Column()
  baseUri: string;

  @Column()
  reference: string;

  @Column()
  nfts: Nft[];
}
