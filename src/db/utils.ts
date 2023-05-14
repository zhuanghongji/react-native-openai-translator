import { DBTableColumn } from './types'

export function dbGenerateInsertStatement(
  tableName: string,
  target: { [key: string]: string | number }
) {
  const keys: string[] = []
  const values: (string | number)[] = []
  for (const key of Object.keys(target)) {
    const value = target[key]
    keys.push(key)
    values.push(typeof value === 'number' ? value : `'${value}'`)
  }
  return `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${values.join(', ')});`
}

export function dbGenerateSelectWhereStatement(
  tableName: string,
  target: { [key: string]: string | number }
) {
  const conditions: (string | number)[] = []
  for (const key of Object.keys(target)) {
    const value = target[key]
    if (value === undefined) {
      continue
    }
    const conditionValue = typeof value === 'number' ? value : `'${value}'`
    conditions.push(`${key} = ${conditionValue}`)
  }
  return `SELECT * FROM ${tableName} WHERE ${conditions.join(' AND ')};`
}

export function dbGenerateCreateTableStatement(
  tableName: string,
  columns: DBTableColumn[]
): string {
  const columnsStatement = columns
    .map(({ name, type, nullable }) => `${name} ${type}${nullable ? '' : " NOT NULL DEFAULT ''"}`)
    .join(' ,')
  const insertTimeStatement = "insert_time TIMESTAMP NOT NULL DEFAULT (DATETIME('NOW','LOCALTIME'))"
  const updateTimeStatement = "update_time TIMESTAMP NOT NULL DEFAULT (DATETIME('NOW','LOCALTIME'))"
  return `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY NOT NULL, ${columnsStatement}, ${insertTimeStatement}, ${updateTimeStatement});`
}

export function dbGenerateAlterTableAddColumnStatement(
  tableName: string,
  column: DBTableColumn
): string {
  const { name, type, nullable } = column
  return `ALTER TABLE ${tableName} ADD COLUMN ${name} ${type}${nullable ? '' : ' NOT NULL'};`
}

export function dbGeneratePragmaTableInfoStatement(tableName: string): string {
  return `PRAGMA TABLE_INFO(${tableName});`
}
