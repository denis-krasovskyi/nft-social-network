import { registerAs } from '@nestjs/config';

export const app = registerAs('app', () => {
  return {
    PORT: parseInt(process.env.PORT, 10),
  };
});
