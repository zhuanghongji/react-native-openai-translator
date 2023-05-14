import { print } from '../printer'
import { DBResultSet, DBSqlExcution } from './types'
import * as SQLite from 'expo-sqlite'

function openDatabase() {
  const db = SQLite.openDatabase('aitranslator.db')
  return db
}

const db = openDatabase()

export function dbExecuteSql<T>(
  excution: DBSqlExcution,
  transactionErrorCallback?: SQLite.SQLTransactionErrorCallback,
  transactionSuccessCallback?: () => void
): Promise<DBResultSet<T>> {
  const { statement, args } = excution
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          statement,
          args,
          (_, resultSet) => {
            print('executeSql', { statement, args, resultSet })
            resolve(resultSet)
          },
          (_, err) => {
            print('executeSql', { statement, args, err })
            reject(err)
            // What is the mean of this return-value ?
            return true
          }
        )
      },
      transactionErrorCallback,
      transactionSuccessCallback
    )
  })
}

export function dbExecuteSqlList<T>(sqls: DBSqlExcution[]): Promise<DBResultSet<T>[]> {
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
