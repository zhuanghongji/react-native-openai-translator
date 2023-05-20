import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TModeWord, TResultBase } from '../types'
import {
  dbGenInsertExecution,
  dbGenSelectExecution,
  dbGenSelectWhereExecution,
  dbGenUpdateWhereExecution,
} from '../utils'

const TABLE_NAME = DBTableName.modeWord

export async function dbFindModeWordWhere(
  target: Pick<TModeWord, 'mode' | 'target_lang' | 'user_content'>
): Promise<TModeWord | null> {
  try {
    const result = await dbExecuteSql<TModeWord>(dbGenSelectWhereExecution(TABLE_NAME, target))
    if (result.rows._array.length === 0) {
      return null
    }
    return result.rows._array[0]
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function dbInsertModeWord(target: Omit<TModeWord, keyof TResultBase>) {
  try {
    const result = await dbExecuteSql<TModeWord>(dbGenInsertExecution(TABLE_NAME, target))
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function dbUpdateModeWordCollected(id: number, toCollected: boolean) {
  try {
    const result = await dbExecuteSql<TModeWord>(
      dbGenUpdateWhereExecution(TABLE_NAME, { collected: toCollected ? '1' : '0' }, { id })
    )
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export function dbMinusModeWord(target: Omit<TModeWord, keyof TResultBase>) {
  return dbExecuteSql<TModeWord>(dbGenInsertExecution(TABLE_NAME, target))
}

export function dbSelectModeWord() {
  return dbExecuteSql<TModeWord>(dbGenSelectExecution(TABLE_NAME))
}
