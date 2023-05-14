import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TResultBase } from '../types'
import { dbGenerateInsertStatement, dbGenerateSelectWhereStatement } from '../utils'

const TABLE_NAME = DBTableName.modeReulst

export interface TModeResult extends TResultBase {
  mode: string
  target_lang: string
  user_content: string
  assistant_content: string
  collected: string
}

export async function dbFindModeResultWhere(
  target: Pick<TModeResult, 'mode' | 'target_lang' | 'user_content'>
): Promise<TModeResult | null> {
  try {
    const result = await dbExecuteSql<TModeResult>(
      dbGenerateSelectWhereStatement(TABLE_NAME, target)
    )
    if (result.rows._array.length === 0) {
      return null
    }
    return result.rows._array[0]
  } catch (e) {
    return Promise.reject(e)
  }
}

export function dbInsertModeResult(target: Omit<TModeResult, keyof TResultBase>) {
  return dbExecuteSql<TModeResult>(dbGenerateInsertStatement(TABLE_NAME, target))
}

export function dbUpdateEnglishWordCollected(id: number, toCollected: boolean) {
  return dbExecuteSql<TModeResult>(
    `UPDATE ${TABLE_NAME} SET collected = ${toCollected ? '1' : '0'} WHERE id = ${id};`
  )
}

export function dbSelectModeResult() {
  return dbExecuteSql<TModeResult>(`SELECT * FROM ${TABLE_NAME};`)
}

export function dbDeleteAllModeResult() {
  return dbExecuteSql<TModeResult>(`DELETE FROM ${TABLE_NAME};`)
}
