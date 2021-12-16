import { app } from './app';
import { mongo } from './mongo';

export { ConfigValidationSchema } from './validation/schema';
export const configuration = [app, mongo];
