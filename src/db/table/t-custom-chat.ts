import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import type { TCustomChat, TResultBase } from '../types'
import { dbGenInsertExecution, dbGenSelectExecution, dbGenSelectWhereExecution } from '../utils'

const TABLE_NAME = DBTableName.customChat

export function dbInsertCustomChat(target: Omit<TCustomChat, keyof TResultBase>) {
  return dbExecuteSql<TCustomChat>(dbGenInsertExecution(TABLE_NAME, target))
}

export function dbFindCustomChatById(id: number) {
  return dbExecuteSql<TCustomChat>(dbGenSelectWhereExecution(TABLE_NAME, { id }))
}

export function dbSelectCustomChat() {
  return dbExecuteSql<TCustomChat>(dbGenSelectExecution(TABLE_NAME))
}
