import { MongoRepository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { PromisePool } from '@supercharge/promise-pool';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';

import { NearIndexerService } from 'src/near-indexer/near-indexer.service';
import { NearApiService } from 'src/near-api/near-api.service';

import { castNftContract, NftContractDto } from './dto/nft-contract.dto';
import { castNft, NftDto } from './dto/nft.dto';
import { Nft } from './entities/nft.entity';
import { NftContract } from './entities/nft-contract.entity';
import {
  PaginationRequest,
  PaginationResponse,
} from '../common/pagination.interface';
import { UserService } from 'src/user/user.service';
import { SearchRequest } from '../common/search.interface';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Nft)
    private nftRepository: MongoRepository<Nft>,

    @InjectRepository(NftContract)
    private nftContractRepository: MongoRepository<NftContract>,

    private readonly userService: UserService,
    private readonly nearIndexerService: NearIndexerService,
    private readonly nearApiService: NearApiService,
    private readonly httpService: HttpService,
  ) {}

  async createOrUpdateNft(nftDto: NftDto) {
    const nftModel = await this.nftRepository.findOne({
      contractId: nftDto.contractId,
      tokenId: nftDto.tokenId,
    });
    return this.nftRepository.save({ ...nftModel, ...nftDto });
  }

  async createOrUpdateNftContract(nftContractDto: NftContractDto) {
    const nftContractModel = await this.nftContractRepository.findOne({
      contractId: nftContractDto.contractId,
    });
    return this.nftContractRepository.save({
      ...nftContractModel,
      ...nftContractDto,
    });
  }

  async setNftVisible(
    userId: string,
    nftId: string,
    visible: boolean,
  ): Promise<Nft> {
    const nftModel = await this.nftRepository.findOne({
      where: { _id: ObjectId(nftId), userId: ObjectId(userId) },
    });

    if (!nftModel) {
      throw new BadRequestException('Invalid nft id');
    }

    return this.nftRepository.save({
      ...nftModel,
      visible,
    });
  }

  async setNftsVisible(
    userId: string,
    nftIds: string[],
    visible: boolean,
  ): Promise<Nft[]> {
    const nftModels = await this.nftRepository.find({
      where: {
        _id: { $in: nftIds.map((id) => ObjectId(id)) },
        userId: ObjectId(userId),
      },
    });
    return this.nftRepository.save(
      nftModels.map((nftModel) => ({ ...nftModel, visible })),
    );
  }

  async getUserNfts(
    userId: string,
    { offset = 0, limit = 10 }: PaginationRequest,
  ): Promise<PaginationResponse<Nft>> {
    const data = await this.nftRepository.find({
      where: { userId: ObjectId(userId) },
      skip: Number(offset),
      take: Number(limit),
    });
    const total = await this.nftRepository.count({ userId: ObjectId(userId) });
    return {
      offset,
      limit,
      total,
      data,
    };
  }

  async getPopularNfts({
    offset = 0,
    limit = 10,
  }: PaginationRequest): Promise<PaginationResponse<Nft>> {
    const data = await this.getNftFeedAggregator()
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();
    const total = await this.nftRepository.count(this.getNftFeedMatch());
    return {
      offset,
      limit,
      total,
      data: data.map(this.buildNftFeed),
    };
  }

  async searchNfts({
    offset = 0,
    limit = 10,
    search,
  }: SearchRequest): Promise<PaginationResponse<Nft>> {
    const data = await this.getNftFeedAggregator(search)
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();
    const total = await this.nftRepository.count(this.getNftFeedMatch(search));
    return {
      offset,
      limit,
      total,
      data: data.map(this.buildNftFeed),
    };
  }

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

    return this.createOrUpdateNftContract(nftContractDto);
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

    return this.createOrUpdateNft(nftDto);
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

  private getNftFeedAggregator(search?: string) {
    return this.nftRepository.aggregate([
      {
        $lookup: {
          from: 'nft_contract',
          localField: 'contractId',
          foreignField: 'contractId',
          as: 'contract',
        },
      },
      { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
      {
        $lookup: {
          from: 'user',
          localField: 'userObjectId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $match: this.getNftFeedMatch(search) },
    ]);
  }

  private getNftFeedMatch(search?: string) {
    if (search) {
      const searchRe = new RegExp(`.*${search}.*`, 'i');
      return {
        visible: true,
        $or: [
          { 'metadata.title': searchRe },
          { 'metadata.description': searchRe },
          { nearAccountId: searchRe },
        ],
      };
    }
    return { visible: true };
  }

  private buildNftFeed(nft) {
    const user = nft.user?.[0];
    const contract = nft.contract?.[0];
    return {
      ...nft,
      contract,
      user: user && {
        id: user.id,
        username: user.username,
        profilePicture: user.profilePicture,
        instagram: user.instagram,
        nearAccounts: user.nearAccounts.map(({ accountId }) => accountId),
      },
    };
  }
}
