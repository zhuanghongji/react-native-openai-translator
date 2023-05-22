import { TPageData } from '../db/types'
import { GetNextPageParamFunction } from '@tanstack/react-query'

export const getNextPageParamForT: GetNextPageParamFunction<TPageData<any>> = lastPage => {
  if (lastPage.items.length === 0 || lastPage.nextCursor === null) {
    return undefined
  }
  return lastPage.nextCursor
}
