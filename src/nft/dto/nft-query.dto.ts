import { IsString } from 'class-validator';
import { PagingQuery } from 'src/common/dto/PagingQuery';

export class NftQuery extends PagingQuery {
  @IsString()
  userId?: string;
}
