import { QueryKey } from '../../query/keys'
import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import type { DBOrderType, DBResultSet, TCustomChat, TResultBase } from '../types'
import {
  dbGenInsertExecution,
  dbGenSelectExecution,
  dbGenSelectWhereExecution,
  dbGenUpdateWhereExecution,
} from '../utils'
import { useQuery } from '@tanstack/react-query'

const TABLE_NAME = DBTableName.customChat

// insert

export function dbInsertCustomChat(target: Omit<TCustomChat, keyof TResultBase>) {
  return dbExecuteSql<TCustomChat>(dbGenInsertExecution(TABLE_NAME, target))
}

// select

export function dbSelectCustomChat(orderBy?: keyof TCustomChat, orderType?: DBOrderType) {
  return dbExecuteSql<TCustomChat>(dbGenSelectExecution(TABLE_NAME, orderBy, orderType))
}

// find

export function dbFindCustomChatById(id: number) {
  return dbExecuteSql<TCustomChat>(dbGenSelectWhereExecution(TABLE_NAME, { id }))
}

// update

export function dbUpdateCustomChatWhere(id: number, values: Partial<TCustomChat>) {
  return dbExecuteSql<TCustomChat>(dbGenUpdateWhereExecution(TABLE_NAME, values, { id }))
}

// query

export function useQueryCustomChat(options: {
  orderBy?: keyof TCustomChat
  orderType?: DBOrderType
  onSuccess?: (data: DBResultSet<TCustomChat>) => void
}) {
  const { orderBy, orderType, onSuccess } = options
  return useQuery({
    queryFn: () => dbSelectCustomChat(orderBy, orderType),
    queryKey: [QueryKey.customChat],
    onSuccess,
  })
}
