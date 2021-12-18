import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

export class UserNearAccount {
  @Column()
  accountId: string;

  @Column()
  enabled: boolean;
}

@Entity()
export class User extends BaseEntity {
  @Column()
  text: string;

  @Column(() => UserNearAccount, { array: true })
  nearAccounts: UserNearAccount[];

  @Column()
  username: string;

  @Column()
  bio: string;

  @Column()
  profilePicture: string;

  @Column()
  instagram: string;
}
