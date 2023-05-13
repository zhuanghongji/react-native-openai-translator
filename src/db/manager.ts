import { DBResultSet } from './types'
import * as SQLite from 'expo-sqlite'

function openDatabase() {
  const db = SQLite.openDatabase('aitranslator.db')
  return db
}

const db = openDatabase()

export function dbExecuteSql<T>(
  sqlStatement: string,
  args?: (number | string | null)[],
  transactionErrorCallback?: SQLite.SQLTransactionErrorCallback,
  transactionSuccessCallback?: () => void
): Promise<DBResultSet<T>> {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          sqlStatement,
          args,
          (_, resultSet) => {
            resolve(resultSet)
          },
          (_, err) => {
            reject(err)
            // TODO what is the mean of this return-value ?
            return true
          }
        )
      },
      transactionErrorCallback,
      transactionSuccessCallback
    )
  })
}

export function dbExecuteSqlList<T>(
  sqls: { statement: string; args?: (number | string | null)[] }[]
): Promise<DBResultSet<T>[]> {
  const results: DBResultSet<T>[] = []
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        sqls.forEach(({ statement, args }, index) => {
          tx.executeSql(statement, args, (_, result) => {
            results[index] = result
          })
        })
      },
      err => reject(err),
      () => resolve(results)
    )
  })
}
