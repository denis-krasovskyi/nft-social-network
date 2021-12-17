import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDto: UserDto): Promise<User> {
    const user = new User();
    user.username = userDto.username;
    user.bio = userDto.bio;
    user.nearAccounts = userDto.nearAccounts;
    user.profilePicture = userDto.profilePicture;

    return this.userRepository.create(user);
  }

  async addNearAccount(userId: string, accountId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    user.nearAccounts = [...user.nearAccounts, accountId];

    return this.userRepository.save(user);
  }

  async findByNearAccount(accountId: string): Promise<User> {
    return this.userRepository.findOne({
      where: { nearAccounts: { $in: [accountId] } },
    });
  }

  async findById(userId: string): Promise<User> {
    return this.userRepository.findOne(userId);
  }
}
