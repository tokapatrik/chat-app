export class CursorPaginationMeta<T> {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
  count: number;
}
