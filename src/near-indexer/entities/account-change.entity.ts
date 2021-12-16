import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Receipt } from './receipt.entity';

@Entity({ name: 'account_changes' })
export class AccountChange {
  @PrimaryColumn()
  id: string;

  @Column()
  affectedAccountId: string;

  @Column({ nullable: true })
  causedByTransactionHash: string;

  @Column({ type: 'bigint' })
  changedInBlockTimestamp: number;

  @OneToOne(() => Receipt, { cascade: true })
  @JoinColumn({ name: 'caused_by_receipt_id' })
  causedByReceipt: Receipt;
}
