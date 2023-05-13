import { print } from '../printer'
import { dbExecuteSql } from './manager'
import { DBTableColumn, DBTableInfoItem } from './types'
import { dbGenerateAlterTableAddColumnStatement, dbGeneratePragmaTableInfoStatement } from './utils'

export async function dbAddColumnIfNotExit(
  tableName: string,
  column: DBTableColumn
): Promise<void> {
  try {
    const pragmaRresult = await dbExecuteSql<DBTableInfoItem>(
      dbGeneratePragmaTableInfoStatement(tableName)
    )
    print('dbAddColumnIfNotExit, pragma = ', pragmaRresult)
    if (!pragmaRresult.rows._array.find(item => item.name === column.name)) {
      const alterResult = await dbExecuteSql(
        dbGenerateAlterTableAddColumnStatement(tableName, column)
      )
      print('dbAddColumnIfNotExit, alter = ', alterResult)
    }
  } catch (e) {
    return Promise.reject(e)
  }
}

export function dropTableWhenDev(tableName: string) {
  if (!__DEV__) {
    return Promise.resolve()
  }
  return dbExecuteSql<unknown>(`DROP TABLE ${tableName}`)
}
