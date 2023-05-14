import { DBSqlExcution, DBSqlExcutionArgs, DBTableColumn } from './types'

// MARK: create

export function dbGenCreateTableExcution(
  tableName: string,
  columns: DBTableColumn[]
): DBSqlExcution {
  const columnsStatement = columns
    .map(({ name, type, nullable }) => `${name} ${type}${nullable ? '' : " NOT NULL DEFAULT ''"}`)
    .join(' ,')
  const insertTimeStatement = "insert_time TIMESTAMP NOT NULL DEFAULT (DATETIME('NOW','LOCALTIME'))"
  const updateTimeStatement = "update_time TIMESTAMP NOT NULL DEFAULT (DATETIME('NOW','LOCALTIME'))"
  return {
    statement: `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY NOT NULL, ${columnsStatement}, ${insertTimeStatement}, ${updateTimeStatement});`,
  }
}

// MARK: alter

export function dbGenAlterTableAddColumnExcution(
  tableName: string,
  column: DBTableColumn
): DBSqlExcution {
  const { name, type, nullable } = column
  return {
    statement: `ALTER TABLE ${tableName} ADD COLUMN ${name} ${type}${nullable ? '' : ' NOT NULL'};`,
  }
}

// MARK: drop

export function dbGenDropTableExcution(tableName: string): DBSqlExcution {
  return { statement: `DROP TABLE ${tableName}` }
}

// MARK: pragma

export function dbGenPragmaTableInfoExcution(tableName: string): DBSqlExcution {
  return {
    statement: `PRAGMA TABLE_INFO(${tableName});`,
  }
}

// MARK: insert

export function dbGenInsertExecution(
  tableName: string,
  target: { [key: string]: string | number }
): DBSqlExcution {
  const keys: string[] = []
  const values: string[] = []
  const args: DBSqlExcutionArgs = []
  for (const key of Object.keys(target)) {
    const value = target[key]
    keys.push(key)
    values.push('?')
    args.push(value)
  }
  return {
    statement: `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${values.join(', ')});`,
    args,
  }
}

// MARK: select

export function dbGenSelectExecution(tableName: string): DBSqlExcution {
  return { statement: `SELECT * FROM ${tableName};` }
}

export function dbGenSelectWhereExecution(
  tableName: string,
  target: { [key: string]: string | number }
): DBSqlExcution {
  const conditions: (string | number)[] = []
  const args: DBSqlExcutionArgs = []
  for (const key of Object.keys(target)) {
    const value = target[key]
    if (value === undefined) {
      continue
    }
    conditions.push(`${key} = ?`)
    args.push(value)
  }
  return {
    statement: `SELECT * FROM ${tableName} WHERE ${conditions.join(' AND ')};`,
    args,
  }
}

// MARK: update

export function dbGenUpdateWhereExecution(
  tableName: string,
  values: { [key: string]: string | number },
  conditions: { [key: string]: string | number }
): DBSqlExcution {
  const args: DBSqlExcutionArgs = []
  // values
  const valuesList: string[] = []
  for (const key of Object.keys(values)) {
    const value = values[key]
    if (value === undefined) {
      continue
    }
    valuesList.push(`${key} = ?`)
    args.push(value)
  }
  const valuesListStr = valuesList.join(', ')
  // conditions
  const conditionList: (string | number)[] = []
  for (const key of Object.keys(conditions)) {
    const condition = conditions[key]
    if (condition === undefined) {
      continue
    }
    conditionList.push(`${key} = ?`)
    args.push(condition)
  }
  const conditionListStr = conditionList.join(' AND ')
  // excution
  return {
    statement: `UPDATE ${tableName} SET ${valuesListStr} WHERE ${conditionListStr};`,
    args,
  }
}

// MARK: delete

export function dbGenDeleteExecution(tableName: string): DBSqlExcution {
  return { statement: `DELETE FROM ${tableName};` }
}
