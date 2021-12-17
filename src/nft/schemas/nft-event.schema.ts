import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NftEventKind } from 'src/near-indexer/types/nft-event-kind';

export type NftEventDocument = NftEvent & Document;

@Schema()
export class NftEvent {
  @Prop({ type: String, required: true, unique: true })
  receiptId: string;

  @Prop({ type: String, required: true })
  contract: string;

  @Prop({ type: String, required: true })
  tokenId: string;

  @Prop({ type: String, required: false })
  tokenOldOwnerAccountId: string;

  @Prop({ type: String, required: false })
  tokenNewOwnerAccountId: string;

  @Prop({ type: Number, required: true })
  timestamp: number;

  @Prop({ required: true, enum: NftEventKind })
  type: NftEventKind;
}

export const NftEventSchema = SchemaFactory.createForClass(NftEvent);
