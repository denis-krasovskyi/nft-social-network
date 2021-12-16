import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'near-api-js/lib/account';

import { NearApiProvider } from './near-api.provider';

@Injectable()
export class NearApiService {
  constructor(
    @Inject('near-api-provider')
    private nearApiProvider: NearApiProvider,
  ) {}

  async getAccount(accountId: string): Promise<Account> {
    return this.nearApiProvider.near.account(accountId);
  }
}
