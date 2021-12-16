import { registerAs } from '@nestjs/config';

export const mongo = registerAs('mongo', () => {
  return {
    uri: process.env.MONGODB_URI,
  };
});
