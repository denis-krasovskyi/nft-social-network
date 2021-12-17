import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Nft } from 'src/nft/schemas/nft.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: [String], required: true })
  nearAccounts: string[];

  @Prop({ type: String, required: false })
  username: string;

  @Prop({ type: String, required: false })
  bio: string;

  @Prop({ type: Buffer, required: false })
  profilePicture: Buffer;

  @Prop({ type: [Types.ObjectId], ref: Nft.name })
  nfts: Nft[];
}

export const UserSchema = SchemaFactory.createForClass(User);
