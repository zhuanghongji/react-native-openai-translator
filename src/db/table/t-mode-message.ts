import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TResultBase } from '../types'
import { dbGenerateInsertStatement } from '../utils'

const TABLE_NAME = DBTableName.modeMessage

export interface TModeMessage extends TResultBase {
  mode: string
  target_lang: string
  role: string
  content: string
}

export function dbInsertModeMessage(target: Omit<TModeMessage, keyof TResultBase>) {
  return dbExecuteSql<TModeMessage>(dbGenerateInsertStatement(TABLE_NAME, target))
}

export function dbSelectModeMessage() {
  return dbExecuteSql<TModeMessage>(`SELECT * FROM ${TABLE_NAME};`)
}
