import { QueryKey } from '../../query/keys'
import { getNextPageParamForT } from '../../query/utils'
import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TCustomChatMessage, TPageParams, TResultBase } from '../types'
import {
  dbExecuteSelectPageable,
  dbGenDeleteWhereExecution,
  dbGenInsertExecution,
  dbGenSelectWhereExecution,
} from '../utils'
import { useInfiniteQuery } from '@tanstack/react-query'

const TABLE_NAME = DBTableName.customChatMessage

export function dbInsertCustomChatMessage(target: Omit<TCustomChatMessage, keyof TResultBase>) {
  return dbExecuteSql<TCustomChatMessage>(dbGenInsertExecution(TABLE_NAME, target))
}

export function dbSelectCustomChatMessageOfChatId(chat_id: number) {
  return dbExecuteSql<TCustomChatMessage>(dbGenSelectWhereExecution(TABLE_NAME, { chat_id }))
}

export function dbSelectCustomChatMessagePageable(chat_id: number, params: TPageParams) {
  return dbExecuteSelectPageable<TCustomChatMessage>(TABLE_NAME, params, { chat_id })
}

export function dbDeleteCustomChatMessageOfChatId(chat_id: number) {
  return dbExecuteSql<TCustomChatMessage>(dbGenDeleteWhereExecution(TABLE_NAME, { chat_id }))
}

export function useInfiniteQueryCustomChatMessagePageable(chat_id: number, pageSize = 20) {
  return useInfiniteQuery({
    queryKey: [QueryKey.customChatMessage, 'infinite', chat_id, pageSize],
    queryFn: ({ pageParam }) => {
      return dbSelectCustomChatMessagePageable(chat_id, { nextCursor: pageParam ?? null, pageSize })
    },
    getNextPageParam: getNextPageParamForT,
  })
}
