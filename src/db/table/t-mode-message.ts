import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TResultBase } from '../types'
import { dbGenerateInsertStatement } from '../utils'

const TABLE_NAME = DBTableName.modeMessage

export interface TModeMessage extends TResultBase {
  result_id: number
  role: string
  content: string
}

export function dbInsertModeMessage(target: Omit<TModeMessage, keyof TResultBase>) {
  return dbExecuteSql<TModeMessage>(dbGenerateInsertStatement(TABLE_NAME, target))
}

export function dbSelectModeMessageOfResultId(result_id: number) {
  return dbExecuteSql<TModeMessage>(`SELECT * FROM ${TABLE_NAME} WHERE result_id = ${result_id};`)
}
