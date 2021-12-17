import { IsNumber } from 'class-validator';
import { SortDirection } from './SortParam';

export class PagingQuery {
  @IsNumber()
  offset = 0;

  @IsNumber()
  limit = 50;

  order: SortDirection;
}
