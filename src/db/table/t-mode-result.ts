import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TResultBase } from '../types'
import { dbGenerateInsertStatement } from '../utils'

const TABLE_NAME = DBTableName.modeMessage

export interface TModeResult extends TResultBase {
  mode: string
  target_lang: string
  user_content: string
  assistnt_content: string
  collected: string
}

export function dbInsertModeResult(target: Omit<TModeResult, keyof TResultBase>) {
  return dbExecuteSql<TModeResult>(dbGenerateInsertStatement(TABLE_NAME, target))
}

export function dbSelectModeResult() {
  return dbExecuteSql<TModeResult>(`SELECT * FROM ${TABLE_NAME};`)
}
