export class CursorPaginationMeta<T> {
  items: T[];
  nextCursor?: string;
  hasNext: boolean;
  count: number;
}
