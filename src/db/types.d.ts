/**
 * Countpart of `SQLResultSet` in `expo-sqlite`
 */
export type DBResultSet<T> = {
  insertId?: number
  rowsAffected: number
  rows: DBResultSetRowList<T>
}

/**
 * Countpart of `SQLResultSetRowList` in `expo-sqlite`
 */
export type DBResultSetRowList<T> = {
  length: number
  item(index: number): T
  _array: T[]
}

export type DBSqlExcutionArgs = (number | string | null)[]

export type DBSqlExcution = {
  statement: string
  args?: DBSqlExcutionArgs
}

export type DBTableColumnType =
  | 'INTEGER'
  | 'CHAR(1)'
  | 'VARCHAR(20)'
  | 'VARCHAR(50)'
  | 'VARCHAR(255)'
  | 'TEXT'

export type DBTableColumn =
  | {
      name: string
      type: DBTableColumnType
      nullable: true
    }
  | {
      name: string
      type: DBTableColumnType
      nullable: fase
      defaultValue: number | string
    }

export interface DBTableInfoItem {
  cid: number
  name: string
  type: string
  notnull: number
  dflt_value?: any
  pk: number
}

export interface TResultBase {
  id: number
  insert_time: number | null
  update_time: number | null
}
