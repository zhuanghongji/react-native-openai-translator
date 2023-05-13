import { dbExecuteSqlList } from './manager'
import { DBTableName } from './table-names'
import { dbGenerateCreateTableStatement } from './utils'

export async function dbInitTables(): Promise<void> {
  try {
    await dbExecuteSqlList([
      {
        statement: dbGenerateCreateTableStatement(DBTableName.test, [
          { name: 'value', type: 'TEXT', nullable: true },
          { name: 'done', type: 'CHAR(1)', nullable: true },
        ]),
      },
      {
        statement: dbGenerateCreateTableStatement(DBTableName.modeReulst, [
          { name: 'mode', type: 'VARCHAR(50)', nullable: true },
          { name: 'target_lang', type: 'VARCHAR(50)', nullable: true },
          { name: 'user_content', type: 'TEXT', nullable: true },
          { name: 'assistnt_content', type: 'TEXT', nullable: true },
          { name: 'collected', type: 'CHAR(1)', nullable: true },
        ]),
      },
      {
        statement: dbGenerateCreateTableStatement(DBTableName.modeMessage, [
          { name: 'mode', type: 'VARCHAR(50)', nullable: true },
          { name: 'target_lang', type: 'VARCHAR(50)', nullable: true },
          { name: 'role', type: 'TEXT', nullable: true },
          { name: 'content', type: 'TEXT', nullable: true },
        ]),
      },
    ])
    // The code below is the example for 'Add Table Column'
    // await dbAddColumnIfNotExit(DBTableName.test, {
    //   name: 'a_number',
    //   type: 'INTEGER',
    //   nullable: true,
    // })
  } catch (e) {
    return Promise.reject(e)
  }
}
