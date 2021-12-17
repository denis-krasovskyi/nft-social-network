import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';

export abstract class BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Exclude()
  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
