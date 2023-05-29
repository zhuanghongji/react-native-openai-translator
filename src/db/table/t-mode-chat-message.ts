import { QueryKey } from '../../query/keys'
import { getNextPageParamForT } from '../../query/utils'
import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TModeChatMessage, TPageParams, TResultBase } from '../types'
import {
  dbExecuteSelectPageable,
  dbGenDeleteWhereExecution,
  dbGenInsertExecution,
  dbGenSelectWhereExecution,
} from '../utils'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

const TABLE_NAME = DBTableName.modeChatMessage

// insert

export function dbInsertModeChatMessage(target: Omit<TModeChatMessage, keyof TResultBase>) {
  return dbExecuteSql<TModeChatMessage>(dbGenInsertExecution(TABLE_NAME, target))
}

// select

export function dbSelectModeChatMessageOfResultId(result_id: number) {
  return dbExecuteSql<TModeChatMessage>(dbGenSelectWhereExecution(TABLE_NAME, { result_id }))
}

export function dbSelectModeChatMessagePageable(result_id: number, params: TPageParams) {
  return dbExecuteSelectPageable<TModeChatMessage>(TABLE_NAME, params, { result_id })
}

// delete

export function dbDeleteModeChatMessageOfResultId(result_id: number) {
  return dbExecuteSql<TModeChatMessage>(dbGenDeleteWhereExecution(TABLE_NAME, { result_id }))
}

// query

export function useQueryModeChatMessageOfResultId(result_id: number) {
  return useQuery({
    queryKey: [QueryKey.modeChatMessage, result_id],
    queryFn: () => dbSelectModeChatMessageOfResultId(result_id),
  })
}

export function useInfiniteQueryModeChatMessagePageable(result_id: number, pageSize = 20) {
  return useInfiniteQuery({
    queryKey: [QueryKey.modeChatMessage, 'infinite', result_id, pageSize],
    queryFn: ({ pageParam }) => {
      return dbSelectModeChatMessagePageable(result_id, { nextCursor: pageParam ?? null, pageSize })
    },
    getNextPageParam: getNextPageParamForT,
  })
}
