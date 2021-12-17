import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NftDocument = Nft & Document;

@Schema()
export class NftMetadata {
  @Prop({ type: Number, required: false })
  copies: number;

  @Prop({ type: String, required: false })
  title: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, required: false })
  expiresAt: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  extra: unknown;

  @Prop({ type: String, required: false })
  issuedAt: string;

  @Prop({ type: String, required: false })
  media: string;

  @Prop({ type: String, required: false })
  mediaHash: string;

  @Prop({ type: String, required: false })
  reference: string;

  @Prop({ type: String, required: false })
  referenceHash: string;

  @Prop({ type: String, required: false })
  startsAt: string;
}

@Schema()
export class Nft {
  @Prop({ type: String, required: true })
  contractId: string;

  @Prop({ type: String, required: true })
  tokenId: string;

  @Prop({ type: String, required: true })
  accountId: string;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: String, required: false })
  minter: string;

  @Prop({ type: String, required: false })
  media: string;

  @Prop({ type: NftMetadata })
  metadata: NftMetadata;

  @Prop({ type: Boolean, required: false })
  posted: boolean;

  @Prop({ type: Date, required: false })
  postedAt: Date;
}

export const NftSchema = SchemaFactory.createForClass(Nft);
