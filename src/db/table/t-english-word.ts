import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TResultBase } from '../types'
import { dbGenerateInsertStatement, dbGenerateSelectWhereStatement } from '../utils'

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
    const result = await dbExecuteSql<TEnglishWord>(
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

export async function dbInsertEnglishWord(target: Omit<TEnglishWord, keyof TResultBase>) {
  try {
    const result = await dbExecuteSql<TEnglishWord>(dbGenerateInsertStatement(TABLE_NAME, target))
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function dbUpdateEnglishWordCollected(id: number, toCollected: boolean) {
  try {
    const result = await dbExecuteSql<TEnglishWord>(
      `UPDATE ${TABLE_NAME} SET collected = ${toCollected ? '1' : '0'} WHERE id = ${id};`
    )
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export function dbMinusEnglishWord(target: Omit<TEnglishWord, keyof TResultBase>) {
  return dbExecuteSql<TEnglishWord>(dbGenerateInsertStatement(TABLE_NAME, target))
}

export function dbSelectEnglishWord() {
  return dbExecuteSql<TEnglishWord>(`SELECT * FROM ${TABLE_NAME};`)
}

// export function dbDeleteAllEnglishWord() {
//   return dbExecuteSql<TEnglishWord>(`DELETE FROM ${TABLE_NAME};`)
// }
