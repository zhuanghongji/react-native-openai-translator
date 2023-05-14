import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TResultBase } from '../types'
import { dbGenerateInsertStatement } from '../utils'

const TABLE_NAME = DBTableName.customMessage

export interface TChatMessage extends TResultBase {
  chat_id: number
  role: string
  content: string
}

export function dbInsertCustomMessage(target: Omit<TChatMessage, keyof TResultBase>) {
  return dbExecuteSql<TChatMessage>(dbGenerateInsertStatement(TABLE_NAME, target))
}

export function dbSelectModeMessageOfChatId(chat_id: number) {
  return dbExecuteSql<TChatMessage>(`SELECT * FROM ${TABLE_NAME} WHERE chat_id = ${chat_id};`)
}
