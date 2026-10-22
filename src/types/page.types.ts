// A page of a paginated endpoint (the backend's PageDto)
export type Page<T> = {
    content: T[],
    page: number,
    size: number,
    totalElements: number,
    totalPages: number,
    last: boolean
}
