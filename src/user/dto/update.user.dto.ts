import { UserNearAccountDto } from './user-near-account.interface';

export class UserDto {
  nearAccounts: UserNearAccountDto[];
  username?: string;
  bio?: string;
  profilePicture?: string;
  instagram?: string;
}
