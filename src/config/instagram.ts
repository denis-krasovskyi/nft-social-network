import { registerAs } from '@nestjs/config';

export const instagram = registerAs('instagram', () => {
  return {
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: process.env.INSTAGRAM_CALLBACK_URL,
  };
});
