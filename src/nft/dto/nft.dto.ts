import * as camelcaseKeys from 'camelcase-keys';

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
  accountId: string,
  nft,
  metadata,
): NftDto {
  const nftToken = camelcaseKeys(nft, { deep: true });
  const nftMetadata = camelcaseKeys(metadata, { deep: true });
  const tokenId = nftToken.id || nftToken.tokenId;
  return {
    ...nftToken,
    contractId,
    accountId: accountId,
    tokenId: tokenId,
    owner: nftToken.ownerId.account || nftToken.ownerId,
    media: nftMetadata.media,
    metadata: nftMetadata,
  };
}
