import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfigService } from 'src/config/typeorm-config.service';

import { NearIndexerService } from './near-indexer.service';
import { Account } from './entities/account.entity';
import { Receipt } from './entities/receipt.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionAction } from './entities/transaction-action.entity';
import { ActionReceiptAction } from './entities/action-receipt-action.entity';
import { ReceiptAction } from './entities/receipt-action.entity';
import { AccountChange } from './entities/account-change.entity';
import { AssetsNftEvent } from './entities/assets-nft-event.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'database-near-indexer',
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature(
      [
        Account,
        Receipt,
        Transaction,
        TransactionAction,
        ActionReceiptAction,
        ReceiptAction,
        AccountChange,
        AssetsNftEvent,
      ],
      'database-near-indexer',
    ),
  ],
  providers: [NearIndexerService],
  exports: [NearIndexerService],
})
export class NearIndexerModule {}
