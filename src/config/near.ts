import { registerAs } from '@nestjs/config';

export const near = registerAs('near', () => {
  return {
    networkId: process.env.NEAR_NETWORK_ID,
    nodeUrl: process.env.NEAR_NODE_URL,
    walletUrl: process.env.NEAR_WALLET_URL,
    helperUrl: process.env.NEAR_HELPER_URL,
    explorerUrl: process.env.NEAR_EXPLORER_URL,
    providerUrl: process.env.NEAR_PROVIDER_URL,
    nearCredentialsDir: process.env.NEAR_CREDENTIALS_DIR || '.near-credentials',
  };
});
