import { PaginationRequest } from './pagination.interface';

export interface SearchRequest extends PaginationRequest {
  search: string;
}
