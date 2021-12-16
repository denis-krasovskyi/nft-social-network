import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Account } from 'src/near-indexer/entities/account.entity';
import { Receipt } from 'src/near-indexer/entities/receipt.entity';
import { ReceiptAction } from 'src/near-indexer/entities/receipt-action.entity';
import { Transaction } from 'src/near-indexer/entities/transaction.entity';
import { TransactionAction } from 'src/near-indexer/entities/transaction-action.entity';
import { ActionReceiptAction } from 'src/near-indexer/entities/action-receipt-action.entity';
import { AccountChange } from 'src/near-indexer/entities/account-change.entity';
import { AssetsNftEvent } from 'src/near-indexer/entities/assets-nft-event.entity';

export const databaseNearIndexer = registerAs(`database-near-indexer`, () => ({
  type: 'postgres',
  host: process.env.NEAR_INDEXER_DATABASE_HOST,
  port: parseInt(process.env.NEAR_INDEXER_DATABASE_PORT, 10),
  database: process.env.NEAR_INDEXER_DATABASE_NAME,
  username: process.env.NEAR_INDEXER_DATABASE_USERNAME,
  password: process.env.NEAR_INDEXER_DATABASE_PASSWORD,
  entities: [
    Account,
    Receipt,
    ReceiptAction,
    Transaction,
    TransactionAction,
    ActionReceiptAction,
    AccountChange,
    AssetsNftEvent,
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
}));
