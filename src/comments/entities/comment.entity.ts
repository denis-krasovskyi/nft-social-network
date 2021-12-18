import { BaseEntity } from 'src/common/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  text: string;

  @Column()
  parentId: string;

  @Column()
  userId: string;

  @Column()
  nftId: string;
}
