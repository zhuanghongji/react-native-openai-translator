import { TPageData } from '../../db/types'
import { UseInfiniteQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'

export function useInfinitePageDataLoader<ItemT>(
  result: UseInfiniteQueryResult<TPageData<ItemT>, unknown>
) {
  const { isFetching, isFetchingNextPage, data: _data, fetchNextPage, hasNextPage } = result

  const items = useMemo<ItemT[]>(() => {
    if (!_data) {
      return []
    }
    return _data.pages.reduce((prev, current) => prev.concat(current.items), [] as ItemT[])
  }, [_data])

  const onFetchNextPage = () => {
    if (!hasNextPage || isFetching || isFetchingNextPage) {
      return
    }
    fetchNextPage()
  }

  return { items, onFetchNextPage }
}
