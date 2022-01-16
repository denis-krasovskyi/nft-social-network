import { AssetsNftEvent } from 'src/near-indexer/entities/assets-nft-event.entity';
import { NftEventKind } from 'src/near-indexer/types/nft-event-kind';

export interface NftEventDto {
  receiptId: string;
  contract: string;
  tokenId: string;
  tokenOldOwnerAccountId: string;
  tokenNewOwnerAccountId: string;
  timestamp: string;
  type: NftEventKind;
}

export function castNftEvent(assetsNftEvent: AssetsNftEvent): NftEventDto {
  return {
    receiptId: assetsNftEvent.emittedForReceiptId,
    contract: assetsNftEvent.emittedByContractAccountId,
    tokenId: assetsNftEvent.tokenId,
    tokenOldOwnerAccountId: assetsNftEvent.tokenOldOwnerAccountId,
    tokenNewOwnerAccountId: assetsNftEvent.tokenNewOwnerAccountId,
    timestamp: String(assetsNftEvent.emittedAtBlockTimestamp),
    type: assetsNftEvent.eventKind as NftEventKind,
  };
}
