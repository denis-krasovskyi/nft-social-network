import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export class NftMetadata {
  @Column()
  copies: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  expiresAt: string;

  @Column()
  extra: unknown;

  @Column()
  issuedAt: string;

  @Column()
  media: string;

  @Column()
  mediaHash: string;

  @Column()
  reference: string;

  @Column()
  referenceHash: string;

  @Column()
  startsAt: string;
}

@Entity()
export class Nft extends BaseEntity {
  @Column()
  contractId: string;

  @Column()
  tokenId: string;

  @Column()
  userId: string;

  @Column()
  nearAccountId: string;

  @Column()
  owner: string;

  @Column()
  minter: string;

  @Column()
  media: string;

  @Column(() => NftMetadata)
  metadata: NftMetadata;

  @Column(() => User)
  user: User;

  @Column()
  visible: boolean;
}
