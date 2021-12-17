export interface PaginationRequest {
  offset: number;
  limit: number;
}

export interface PaginationResponse<T> {
  offset: number;
  limit: number;
  total: number;
  data: T[];
}
