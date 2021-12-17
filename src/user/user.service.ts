import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: UserDto): Promise<UserDocument> {
    const model = await this.userModel.create(user);
    return model.save();
  }

  async addNearAccount(
    userId: string,
    accountId: string,
  ): Promise<UserDocument> {
    const model = await this.findById(userId);
    model.nearAccounts = [...model.nearAccounts, accountId];
    return model.save();
  }

  async findByNearAccount(accountId: string): Promise<UserDocument> {
    return this.userModel
      .findOne({ nearAccounts: { $in: [accountId] } })
      .exec();
  }

  async findById(userId: string): Promise<UserDocument> {
    return this.userModel.findById(userId).exec();
  }
}
