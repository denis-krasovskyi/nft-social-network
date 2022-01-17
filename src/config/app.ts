import { registerAs } from '@nestjs/config';

export const app = registerAs('app', () => {
  return {
    port: parseInt(process.env.PORT, 10),
    frontendUrl: process.env.FRONTEND_URL,
    jwtSecret: process.env.JWT_SECRET,
    nftAggregationInterval: parseInt(process.env.NFT_AGGREGATION_INTERVAL, 10),
  };
});
