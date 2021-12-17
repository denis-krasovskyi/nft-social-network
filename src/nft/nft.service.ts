import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { PromisePool } from '@supercharge/promise-pool';
import { NearIndexerService } from 'src/near-indexer/near-indexer.service';
import { NearApiService } from 'src/near-api/near-api.service';

import { castNftContract, NftContractDto } from './dto/nft-contract.dto';
import { castNft } from './dto/nft.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Nft } from './entities/nft.entity';
import { NftContract } from './entities/nft-contract.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Nft)
    private nftRepository: Repository<Nft>,

    @InjectRepository(NftContract)
    private nftContractRepository: Repository<NftContract>,

    private readonly userService: UserService,
    private readonly nearIndexerService: NearIndexerService,
    private readonly nearApiService: NearApiService,
    private readonly httpService: HttpService,
  ) {}

  async loadAllAccountNfts(accountId: string) {
    const user = await this.userService.findByNearAccount(accountId);

    const nftContracts = await this.nearIndexerService.findLikelyNFTs(
      accountId,
    );
    await PromisePool.withConcurrency(5)
      .for(nftContracts)
      .process(async (nftContract) =>
        this.loadAccountNftsByContract(
          nftContract,
          accountId,
          user.id.toString(),
        ),
      );
  }

  async loadAccountNftsByContract(
    nftContractId: string,
    accountId: string,
    userId: string,
  ) {
    const nfts = await this.nearApiService.getAccountNfts(
      nftContractId,
      accountId,
    );
    const metadata = await this.nearApiService.getNftMetadata(nftContractId);
    const nftContractDto = castNftContract(nftContractId, metadata);

    await PromisePool.withConcurrency(5)
      .for(nfts)
      .process(async (nft) =>
        this.loadAccountNft(accountId, nftContractDto, nft, userId),
      );

    return this.nftContractRepository.update(nftContractId, nftContractDto);
  }

  async loadAccountNft(
    accountId: string,
    nftContractDto: NftContractDto,
    nft,
    userId: string,
  ) {
    const metadata = await this.loadNftMetadata(nftContractDto, nft);
    const nftDto = castNft(
      nftContractDto.contractId,
      accountId,
      nft,
      metadata,
      userId,
    );

    return this.nftRepository.update(
      { contractId: nftContractDto.contractId, tokenId: nftDto.tokenId },
      nftDto,
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
