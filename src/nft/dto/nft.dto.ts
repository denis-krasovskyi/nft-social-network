import * as camelcaseKeys from 'camelcase-keys';
import { ObjectId } from 'mongodb';

export interface NftDto {
  contractId: string;
  tokenId: string;
  accountId: string;
  owner: string;
  minter: string;
  media: string;
  metadata: Record<string, unknown>;
}

export function castNft(
  contractId: string,
  nearAccountId: string,
  nft: any,
  metadata: any,
  userId: string,
): NftDto {
  const nftToken = camelcaseKeys(nft, { deep: true });
  const nftMetadata = camelcaseKeys(metadata, { deep: true });
  const tokenId = nftToken.id || nftToken.tokenId;
  delete nftToken.id;
  return {
    ...nftToken,
    contractId,
    userId: ObjectId(userId),
    nearAccountId,
    tokenId: tokenId,
    owner: nftToken.ownerId.account || nftToken.ownerId,
    media: nftMetadata.media,
    metadata: nftMetadata,
  };
}
