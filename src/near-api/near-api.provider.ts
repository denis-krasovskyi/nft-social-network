import { ConfigService } from '@nestjs/config';
import { connect, Near, providers } from 'near-api-js';
import { UnencryptedFileSystemKeyStore } from 'near-api-js/lib/key_stores';
import { Provider } from 'near-api-js/lib/providers';
import { join } from 'path';
import { homedir } from 'os';

export type NearApiProvider = {
  provider: Provider;
  near: Near;
};

export const nearApiProvider = {
  provide: 'near-api-provider',
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<NearApiProvider> => {
    const {
      networkId,
      nodeUrl,
      walletUrl,
      helperUrl,
      providerUrl,
      nearCredentialsDir,
    } = configService.get('near');

    const near = await connect({
      keyStore: new UnencryptedFileSystemKeyStore(
        join(homedir(), nearCredentialsDir),
      ),
      networkId,
      nodeUrl,
      walletUrl,
      helperUrl,
      headers: {},
    });
    const provider = new providers.JsonRpcProvider({ url: providerUrl });

    return {
      near,
      provider,
    };
  },
};
