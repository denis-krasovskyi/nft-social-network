import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Nft } from './nft.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true })
  accountId: string;

  @Prop({ type: [Types.ObjectId], ref: Nft.name })
  nfts: Nft[];
}

export const UserSchema = SchemaFactory.createForClass(User);
