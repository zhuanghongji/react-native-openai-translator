import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TResultBase } from '../types'
import { dbGenInsertExecution, dbGenSelectWhereExecution } from '../utils'

const TABLE_NAME = DBTableName.modeMessage

export interface TModeMessage extends TResultBase {
  result_id: number
  role: string
  content: string
}

export function dbInsertModeMessage(target: Omit<TModeMessage, keyof TResultBase>) {
  return dbExecuteSql<TModeMessage>(dbGenInsertExecution(TABLE_NAME, target))
}

export function dbSelectModeMessageOfResultId(result_id: number) {
  return dbExecuteSql<TModeMessage>(dbGenSelectWhereExecution(TABLE_NAME, { result_id }))
}
