import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TResultBase } from '../types'
import { dbGenInsertExecution, dbGenSelectWhereExecution } from '../utils'

const TABLE_NAME = DBTableName.customMessage

export interface TChatMessage extends TResultBase {
  chat_id: number
  role: string
  content: string
}

export function dbInsertCustomMessage(target: Omit<TChatMessage, keyof TResultBase>) {
  return dbExecuteSql<TChatMessage>(dbGenInsertExecution(TABLE_NAME, target))
}

export function dbSelectModeMessageOfChatId(chat_id: number) {
  return dbExecuteSql<TChatMessage>(dbGenSelectWhereExecution(TABLE_NAME, { chat_id }))
}
