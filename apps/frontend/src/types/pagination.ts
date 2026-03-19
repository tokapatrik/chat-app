export type CursorPagination = {
  cursor?: string;
  limit: number;
};

export type CursorPaginatedResponse<T> = {
  items: T[];
  nextCursor?: string;
  hasNext: boolean;
  count: number;
};
