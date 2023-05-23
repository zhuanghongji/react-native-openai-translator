import { TranslatorMode } from '../../preferences/options'
import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TModeResult, TResultBase } from '../types'
import {
  dbGenDeleteExecution,
  dbGenDeleteWhereExecution,
  dbGenInsertExecution,
  dbGenSelectExecution,
  dbGenSelectWhereExecution,
  dbGenUpdateWhereExecution,
} from '../utils'

const TABLE_NAME = DBTableName.modeReulst

// select

export function dbSelectModeResult() {
  return dbExecuteSql<TModeResult>(dbGenSelectExecution(TABLE_NAME))
}

export function dbSelectModeResultWhereMode(mode: TranslatorMode) {
  return dbExecuteSql<TModeResult>(dbGenSelectWhereExecution(TABLE_NAME, { mode }))
}

export async function dbFindModeResultWhere(
  target: Pick<TModeResult, 'mode' | 'target_lang' | 'user_content'>
): Promise<TModeResult | null> {
  try {
    const result = await dbExecuteSql<TModeResult>(dbGenSelectWhereExecution(TABLE_NAME, target))
    if (result.rows._array.length === 0) {
      return null
    }
    return result.rows._array[0]
  } catch (e) {
    return Promise.reject(e)
  }
}

// insert

export function dbInsertModeResult(target: Omit<TModeResult, keyof TResultBase>) {
  return dbExecuteSql<TModeResult>(dbGenInsertExecution(TABLE_NAME, target))
}

// update

export function dbUpdateModeResultCollectedOfId(id: number, toCollected: boolean) {
  return dbExecuteSql<TModeResult>(
    dbGenUpdateWhereExecution(TABLE_NAME, { collected: toCollected ? '1' : '0' }, { id })
  )
}

// delete

export function dbDeleteModeResultOfId(id: number) {
  return dbExecuteSql<TModeResult>(dbGenDeleteWhereExecution(TABLE_NAME, { id }))
}

export function dbDeleteAllModeResult() {
  return dbExecuteSql<TModeResult>(dbGenDeleteExecution(TABLE_NAME))
}
