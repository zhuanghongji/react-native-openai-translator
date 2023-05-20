import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TCustomChatMessage, TResultBase } from '../types'
import {
  dbGenDeleteWhereExecution,
  dbGenInsertExecution,
  dbGenSelectWhereExecution,
} from '../utils'

const TABLE_NAME = DBTableName.customChatMessage

export function dbInsertCustomMessage(target: Omit<TCustomChatMessage, keyof TResultBase>) {
  return dbExecuteSql<TCustomChatMessage>(dbGenInsertExecution(TABLE_NAME, target))
}

export function dbSelectCustomChatMessageOfChatId(chat_id: number) {
  return dbExecuteSql<TCustomChatMessage>(dbGenSelectWhereExecution(TABLE_NAME, { chat_id }))
}

export function dbDeleteCustomChatMessageOfChatId(chat_id: number) {
  return dbExecuteSql<TCustomChatMessage>(dbGenDeleteWhereExecution(TABLE_NAME, { chat_id }))
}
