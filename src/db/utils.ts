import {
  DBSqlExcution,
  DBSqlExcutionArgs,
  DBSqlExcutionConditions,
  DBSqlExcutionValues,
  DBTableColumn,
} from './types'

function genInsertKeyValueListStr(
  args: DBSqlExcutionArgs,
  values: DBSqlExcutionValues
): {
  keyListStr: string
  valueListStr: string
} {
  const keyList: string[] = []
  const valueList: (string | number | null)[] = []
  for (const key of Object.keys(values)) {
    const value = values[key]
    args.push(value)
    keyList.push(key)
    valueList.push('?')
  }
  const keyListStr = keyList.join(', ')
  const valueListStr = valueList.join(', ')
  return { keyListStr, valueListStr }
}

function genSetValueListStr(args: DBSqlExcutionArgs, values: DBSqlExcutionValues): string {
  const valueList: string[] = []
  for (const key of Object.keys(values)) {
    const value = values[key]
    if (value === undefined) {
      continue
    }
    valueList.push(`${key} = ?`)
    args.push(value)
  }
  return valueList.join(', ')
}

function genWhereConditionListStr(
  args: DBSqlExcutionArgs,
  conditions: DBSqlExcutionConditions
): string {
  const conditionList: (string | number)[] = []
  for (const key of Object.keys(conditions)) {
    const condition = conditions[key]
    if (condition === undefined) {
      continue
    }
    conditionList.push(`${key} = ?`)
    args.push(condition)
  }
  return conditionList.join(' AND ')
}

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
  values: DBSqlExcutionValues
): DBSqlExcution {
  const args: DBSqlExcutionArgs = []
  const { keyListStr, valueListStr } = genInsertKeyValueListStr(args, values)
  return {
    statement: `INSERT INTO ${tableName} (${keyListStr}) VALUES (${valueListStr});`,
    args,
  }
}

// MARK: select

export function dbGenSelectExecution(tableName: string): DBSqlExcution {
  return { statement: `SELECT * FROM ${tableName};` }
}

export function dbGenSelectWhereExecution(
  tableName: string,
  conditions: DBSqlExcutionConditions
): DBSqlExcution {
  const args: DBSqlExcutionArgs = []
  const conditionListStr = genWhereConditionListStr(args, conditions)
  return {
    statement: `SELECT * FROM ${tableName} WHERE ${conditionListStr};`,
    args,
  }
}

// MARK: update

export function dbGenUpdateWhereExecution(
  tableName: string,
  values: DBSqlExcutionValues,
  conditions: DBSqlExcutionConditions
): DBSqlExcution {
  const args: DBSqlExcutionArgs = []
  const valuesListStr = genSetValueListStr(args, values)
  const conditionListStr = genWhereConditionListStr(args, conditions)
  return {
    statement: `UPDATE ${tableName} SET ${valuesListStr} WHERE ${conditionListStr};`,
    args,
  }
}

// MARK: delete

export function dbGenDeleteExecution(tableName: string): DBSqlExcution {
  return { statement: `DELETE FROM ${tableName};` }
}

export function dbGenDeleteWhereExecution(
  tableName: string,
  conditions: DBSqlExcutionConditions
): DBSqlExcution {
  const args: DBSqlExcutionArgs = []
  const conditionListStr = genWhereConditionListStr(args, conditions)
  return { statement: `DELETE FROM ${tableName} WHERE ${conditionListStr};`, args }
}
