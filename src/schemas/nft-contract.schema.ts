import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Nft } from './nft.schema';

export type NftContractDocument = NftContract & Document;

@Schema()
export class NftContract {
  @Prop({ type: String, required: true, unique: true })
  contractId: string;

  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: String, required: false })
  spec: string;

  @Prop({ type: String, required: false })
  icon: string;

  @Prop({ type: String, required: false })
  symbol: string;

  @Prop({ type: String, required: false })
  baseUri: string;

  @Prop({ type: String, required: false })
  reference: string;

  @Prop({ type: [Types.ObjectId], ref: Nft.name })
  nfts: Nft[];
}

export const NftContractSchema = SchemaFactory.createForClass(NftContract);
