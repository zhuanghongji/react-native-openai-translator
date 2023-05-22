import type { InfiniteQueryFooterType } from './types'
import { UseInfiniteQueryResult } from '@tanstack/react-query'

export function getInfiniteQueryFooterType(
  isEmpty: boolean,
  result: UseInfiniteQueryResult<unknown, unknown>
): InfiniteQueryFooterType {
  const { status, isFetching, isFetchingNextPage, hasNextPage } = result
  if (status === 'loading' || isFetching || isFetchingNextPage) {
    return 'loading'
  }
  if (status === 'success' && isEmpty) {
    return 'none'
  }
  if (status === 'error') {
    return 'error'
  }
  if (!hasNextPage) {
    return 'done'
  }
  return 'more'
}
