import * as camelcaseKeys from 'camelcase-keys';

export interface NftContractDto {
  contractId: string;
  name: string;
  spec: string;
  icon: string;
  symbol: string;
  baseUri: string;
  reference: string;
}

export function castNftContract(contractId: string, metadata): NftContractDto {
  return {
    ...camelcaseKeys(metadata, { deep: true }),
    contractId,
  };
}
