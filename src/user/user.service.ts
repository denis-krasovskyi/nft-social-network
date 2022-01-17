import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserDto } from './dto/update.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { UserProfileDto } from './dto/user-profile.interface';
import { UserNearAccountDto } from './dto/user-near-account.interface';
import { SearchRequest } from '../common/search.interface';
import { PaginationResponse } from '../common/pagination.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {}

  async create(userDto: UserDto): Promise<User> {
    const user = new User();
    user.username = userDto.username;
    user.bio = userDto.bio;
    user.nearAccounts = userDto.nearAccounts;
    user.profilePicture = userDto.profilePicture;
    return this.userRepository.save(user);
  }

  async addNearAccount(
    userId: string,
    nearAccount: UserNearAccountDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    user.nearAccounts = [...user.nearAccounts, nearAccount];

    return this.userRepository.save(user);
  }

  async updateUserProfile(
    userId: string,
    { username, bio, profilePicture, instagram }: UserProfileDto,
  ): Promise<boolean> {
    await this.userRepository.update(userId, {
      username,
      bio,
      profilePicture,
      instagram,
    });
    return true;
  }

  async setNearAccountStatus(
    userId: string,
    nearAccountId: string,
    enabled: boolean,
  ) {
    const user = await this.findById(userId);
    await this.userRepository.save(user);
    const nearAccount = user.nearAccounts.find(
      ({ accountId }) => nearAccountId === accountId,
    );

    if (!nearAccount) {
      throw new BadRequestException('Invalid near account id');
    }
    nearAccount.enabled = enabled;

    return this.userRepository.save(user);
  }

  async findByNearAccount(accountId: string): Promise<User> {
    return this.userRepository.findOne({
      where: { nearAccounts: { $elemMatch: { accountId } } },
    });
  }

  async findById(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { _id: ObjectId(userId) } });
  }

  async findAllNearAccounts(): Promise<string[]> {
    const allUserAccounts = await this.userRepository.find({
      select: ['nearAccounts'],
    });
    return allUserAccounts.flatMap(({ nearAccounts }) =>
      nearAccounts.map(({ accountId }) => accountId),
    );
  }

  async searchUsers({
    offset = 0,
    limit = 10,
    search,
  }: SearchRequest): Promise<PaginationResponse<User>> {
    const searchRe = new RegExp(`.*${search}.*`, 'i');
    const where = search
      ? {
          $or: [
            { 'nearAccounts.accountId': searchRe },
            { username: searchRe },
            { instagram: searchRe },
          ],
        }
      : undefined;
    const data = await this.userRepository.find({
      where,
      skip: Number(offset),
      take: Number(limit),
    });
    const total = await this.userRepository.count({ ...where });
    return {
      offset,
      limit,
      total,
      data: data,
    };
  }
}
