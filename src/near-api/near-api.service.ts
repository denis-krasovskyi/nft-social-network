import { Inject, Injectable } from '@nestjs/common';
import { Account, Contract } from 'near-api-js';

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

  async getNftMetadata(contractId: string) {
    const contract = this.getNftContract(contractId);
    return contract.nft_metadata();
  }

  async getAccountNfts(contractId: string, accountId: string) {
    const contract = this.getNftContract(contractId);
    const chunkSize = 100;
    let nfts = [];
    let chunk = [];
    let fromIndex = 0;

    do {
      try {
        chunk = await contract.nft_tokens_for_owner({
          account_id: accountId,
          from_index: fromIndex.toString(),
          limit: chunkSize,
        });
        fromIndex += chunkSize;
        nfts = nfts.concat(chunk);
      } catch (err) {
        break;
      }
    } while (chunk.length === chunkSize);

    return nfts;
  }

  private getNftContract(contractId: string): Contract & any {
    return new Contract(this.nearApiProvider.account, contractId, {
      viewMethods: ['nft_tokens_for_owner', 'nft_metadata'],
      changeMethods: [],
    });
  }
}
