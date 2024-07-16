export type Pagination<TData> = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  data: Array<TData>
};
