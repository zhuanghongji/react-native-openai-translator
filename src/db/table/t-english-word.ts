import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TResultBase } from '../types'
import {
  dbGenInsertExecution,
  dbGenSelectExecution,
  dbGenSelectWhereExecution,
  dbGenUpdateWhereExecution,
} from '../utils'

const TABLE_NAME = DBTableName.englishWord

export interface TEnglishWord extends TResultBase {
  mode: string
  target_lang: string
  user_content: string
  assistant_content: string
  collected: string
}

export async function dbFindEnglishWordWhere(
  target: Pick<TEnglishWord, 'mode' | 'target_lang' | 'user_content'>
): Promise<TEnglishWord | null> {
  try {
    const result = await dbExecuteSql<TEnglishWord>(dbGenSelectWhereExecution(TABLE_NAME, target))
    if (result.rows._array.length === 0) {
      return null
    }
    return result.rows._array[0]
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function dbInsertEnglishWord(target: Omit<TEnglishWord, keyof TResultBase>) {
  try {
    const result = await dbExecuteSql<TEnglishWord>(dbGenInsertExecution(TABLE_NAME, target))
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function dbUpdateEnglishWordCollected(id: number, toCollected: boolean) {
  try {
    const result = await dbExecuteSql<TEnglishWord>(
      dbGenUpdateWhereExecution(TABLE_NAME, { collected: toCollected ? '1' : '0' }, { id })
    )
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export function dbMinusEnglishWord(target: Omit<TEnglishWord, keyof TResultBase>) {
  return dbExecuteSql<TEnglishWord>(dbGenInsertExecution(TABLE_NAME, target))
}

export function dbSelectEnglishWord() {
  return dbExecuteSql<TEnglishWord>(dbGenSelectExecution(TABLE_NAME))
}
