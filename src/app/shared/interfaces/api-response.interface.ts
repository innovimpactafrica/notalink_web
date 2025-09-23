export interface PaginatedResponse<T> {
  content: T[]; // Remplace data par content pour les réponses paginées
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  number: number;
  numberOfElements: number;
  size: number;
}
