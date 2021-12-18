import { PaginationRequest } from 'src/common/pagination.interface';

export interface PaginationCommentRequest extends PaginationRequest {
  userId?: string;
  nftId?: string;
}
