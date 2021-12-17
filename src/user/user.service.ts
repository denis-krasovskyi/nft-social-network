import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/schemas/user.schema';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: UserDto): Promise<UserDocument> {
    const model = await this.userModel.create(user);
    return model.save();
  }

  async findByAccount(accountId: string): Promise<UserDocument> {
    return this.userModel.findOne({ accountId }).exec();
  }
}
