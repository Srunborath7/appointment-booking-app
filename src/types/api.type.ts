export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface PaginatedData<T> {
  total_records: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  lists: T[];
}

export interface PaginatedApiResponse<T> {
  code: number;
  msg: string;
  data: PaginatedData<T>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string | number,
    message: string,
    public readonly details?: Record<string, string[]> | unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
