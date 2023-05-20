import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TCustomChatMessage, TResultBase } from '../types'
import { dbGenInsertExecution, dbGenSelectWhereExecution } from '../utils'

const TABLE_NAME = DBTableName.customChatMessage

export function dbInsertCustomMessage(target: Omit<TCustomChatMessage, keyof TResultBase>) {
  return dbExecuteSql<TCustomChatMessage>(dbGenInsertExecution(TABLE_NAME, target))
}

export function dbSelecTModeChatMessageOfChatId(chat_id: number) {
  return dbExecuteSql<TCustomChatMessage>(dbGenSelectWhereExecution(TABLE_NAME, { chat_id }))
}
