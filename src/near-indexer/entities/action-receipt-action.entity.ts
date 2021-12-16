import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Transaction } from './transaction.entity';
import { ActionKind } from '../types/action-kind';

@Entity({ name: 'action_receipt_actions' })
export class ActionReceiptAction {
  @PrimaryColumn()
  receiptId: string;

  @PrimaryColumn()
  indexInActionReceipt: number;

  @OneToOne(() => Transaction)
  @JoinColumn({
    name: 'receipt_id',
    referencedColumnName: 'convertedIntoReceiptId',
  })
  transaction: Transaction;

  @Column()
  receiptPredecessorAccountId: string;

  @Column()
  receiptReceiverAccountId: string;

  @Column({
    type: 'enum',
    enum: ActionKind,
  })
  actionKind: string;

  @Column({ type: 'simple-json' })
  args: Record<string, unknown>;
}
