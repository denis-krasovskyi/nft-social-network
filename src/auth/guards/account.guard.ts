import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import tweetnacl from 'tweetnacl';
import { PublicKey } from 'near-api-js/lib/utils';

import { NearApiService } from 'src/near-api/near-api.service';

@Injectable()
export class AccountAccessGuard implements CanActivate {
  constructor(private nearApiService: NearApiService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { accountId, publicKey, signature } = req.body;

    const account = await this.nearApiService.getAccount(accountId);

    let accessKeys;
    try {
      accessKeys = await account.getAccessKeys();
    } catch (err) {
      throw new ForbiddenException(`Authorization header is invalid`);
    }

    if (!accessKeys.find((key) => key.public_key === publicKey)) {
      throw new ForbiddenException(
        `Account ${accountId} identity is invalid - public key`,
      );
    }

    let isValid = true;
    try {
      isValid = tweetnacl.sign.detached.verify(
        Buffer.from(publicKey),
        Buffer.from(signature, 'base64'),
        PublicKey.fromString(publicKey).data,
      );
    } catch (error) {
      throw new ForbiddenException('Invalid signature');
    }

    if (!isValid) {
      throw new ForbiddenException('Invalid signature');
    }

    req.near = { accountId };

    return isValid;
  }
}
