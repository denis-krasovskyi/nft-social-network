import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

import { ActionKind } from '../types/action-kind';

@Entity({ name: 'transaction_actions' })
export class TransactionAction extends BaseEntity {
  @PrimaryColumn()
  transactionHash: string;

  @Column()
  indexInTransaction: number;

  @Column({
    type: 'enum',
    enum: ActionKind,
  })
  actionKind: string;

  @Column({ type: 'jsonb', nullable: true })
  args: Record<string, unknown>;
}
