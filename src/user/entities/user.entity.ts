import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { Nft } from 'src/nft/entities/nft.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  text: string;

  @Column()
  nearAccounts: string[];

  @Column()
  username: string;

  @Column()
  bio: string;

  @Column()
  profilePicture: string;

  @Column()
  nfts: Nft[];
}
