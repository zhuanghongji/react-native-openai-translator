import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TModeChatMessage, TResultBase } from '../types'
import { dbGenInsertExecution, dbGenSelectWhereExecution } from '../utils'

const TABLE_NAME = DBTableName.modeChatMessage

export function dbInsertModeChatMessage(target: Omit<TModeChatMessage, keyof TResultBase>) {
  return dbExecuteSql<TModeChatMessage>(dbGenInsertExecution(TABLE_NAME, target))
}

export function dbSelectModeChatMessageOfResultId(result_id: number) {
  return dbExecuteSql<TModeChatMessage>(dbGenSelectWhereExecution(TABLE_NAME, { result_id }))
}
