import { registerAs } from '@nestjs/config';

export const app = registerAs('app', () => {
  return {
    port: parseInt(process.env.PORT, 10),
  };
});
