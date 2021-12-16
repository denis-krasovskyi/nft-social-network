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
    const [accountId, publicKey, signature] =
      req.headers.Authorization?.split(' ') || [];
    const account = await this.nearApiService.getAccount(accountId);

    if (!account) {
      return false;
    }

    const accessKeys = await account.getAccessKeys();

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
      throw new ForbiddenException(error.message);
    }

    if (!isValid) {
      throw new ForbiddenException('Invalid signature');
    }

    return isValid;
  }
}
