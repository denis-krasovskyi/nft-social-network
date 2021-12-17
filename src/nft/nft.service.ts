import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom, map } from 'rxjs';
import { PromisePool } from '@supercharge/promise-pool';

import { Nft, NftDocument } from 'src/schemas/nft.schema';
import {
  NftContract,
  NftContractDocument,
} from 'src/schemas/nft-contract.schema';
import { NftEvent, NftEventDocument } from 'src/schemas/nft-event.schema';
import { NearIndexerService } from 'src/near-indexer/near-indexer.service';
import { NearApiService } from 'src/near-api/near-api.service';

import { castNftContract, NftContractDto } from './dto/nft-contract.dto';
import { castNft } from './dto/nft.dto';

@Injectable()
export class NftService {
  constructor(
    @InjectModel(Nft.name) private nftModel: Model<NftDocument>,
    @InjectModel(NftContract.name)
    private nftContractModel: Model<NftContractDocument>,
    @InjectModel(NftEvent.name) private nftEventModel: Model<NftEventDocument>,
    private readonly nearIndexerService: NearIndexerService,
    private readonly nearApiService: NearApiService,
    private readonly httpService: HttpService,
  ) {}

  async loadAllAccountNfts(accountId: string) {
    const nftContracts = await this.nearIndexerService.findLikelyNFTs(
      accountId,
    );
    await PromisePool.withConcurrency(5)
      .for(nftContracts)
      .process(async (nftContract) =>
        this.loadAccountNftsByContract(nftContract, accountId),
      );
  }

  async loadAccountNftsByContract(nftContractId: string, accountId: string) {
    const nfts = await this.nearApiService.getAccountNfts(
      nftContractId,
      accountId,
    );
    const metadata = await this.nearApiService.getNftMetadata(nftContractId);
    const nftContractDto = castNftContract(nftContractId, metadata);

    await PromisePool.withConcurrency(5)
      .for(nfts)
      .process(async (nft) =>
        this.loadAccountNft(accountId, nftContractDto, nft),
      );

    await this.nftContractModel.updateOne(
      { contractId: nftContractId },
      nftContractDto,
      { upsert: true },
    );
  }

  async loadAccountNft(accountId: string, nftContractDto: NftContractDto, nft) {
    const metadata = await this.loadNftMetadata(nftContractDto, nft);
    const nftDto = castNft(nftContractDto.contractId, accountId, nft, metadata);
    await this.nftModel.updateOne(
      { contractId: nftContractDto.contractId, tokenId: nftDto.tokenId },
      nftDto,
      { upsert: true },
    );
  }

  async loadNftMetadata(nftContractDto: NftContractDto, nft) {
    const { baseUri } = nftContractDto;
    const { media, reference } = nft.metadata;

    if (media?.indexOf('http') === 0) {
      return nft.metadata;
    }

    if (baseUri && media) {
      return {
        ...nft.metadata,
        media: `${baseUri}/${media}`,
      };
    }

    if (baseUri && !media && reference) {
      try {
        const metadata = await lastValueFrom(
          this.httpService
            .get(`${baseUri}/${reference}`)
            .pipe(map((res) => res.data)),
        );
        return {
          ...nft.metadata,
          ...metadata,
        };
      } catch (err) {}
    }

    if (media) {
      return {
        ...nft.metadata,
        media: `https://cloudflare-ipfs.com/ipfs/${media}`,
      };
    }

    return nft.metadata;
  }
}
