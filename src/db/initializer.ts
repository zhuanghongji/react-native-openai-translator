import { dbExecuteSqlList } from './manager'
import { DBTableName } from './table-names'
import { dbGenerateCreateTableStatement } from './utils'

export async function dbInitTables(): Promise<void> {
  try {
    await dbExecuteSqlList([
      {
        // t-test
        statement: dbGenerateCreateTableStatement(DBTableName.test, [
          { name: 'value', type: 'TEXT', nullable: true },
          { name: 'done', type: 'CHAR(1)', nullable: true },
        ]),
      },
      {
        // t-mode-result
        statement: dbGenerateCreateTableStatement(DBTableName.modeReulst, [
          { name: 'mode', type: 'VARCHAR(50)', nullable: true },
          { name: 'target_lang', type: 'VARCHAR(50)', nullable: true },
          { name: 'user_content', type: 'TEXT', nullable: true },
          { name: 'assistant_content', type: 'TEXT', nullable: true },
          { name: 'collected', type: 'CHAR(1)', nullable: true },
        ]),
      },
      {
        // t-mode-message
        statement: dbGenerateCreateTableStatement(DBTableName.modeMessage, [
          { name: 'result_id', type: 'INTEGER', nullable: true },
          { name: 'role', type: 'VARCHAR(50)', nullable: true },
          { name: 'content', type: 'TEXT', nullable: true },
        ]),
      },
      {
        // t-english-word
        statement: dbGenerateCreateTableStatement(DBTableName.englishWord, [
          { name: 'mode', type: 'VARCHAR(50)', nullable: true },
          { name: 'target_lang', type: 'VARCHAR(50)', nullable: true },
          { name: 'user_content', type: 'TEXT', nullable: true },
          { name: 'assistant_content', type: 'TEXT', nullable: true },
          { name: 'collected', type: 'CHAR(1)', nullable: true },
        ]),
      },
      {
        // t-custom-chat
        statement: dbGenerateCreateTableStatement(DBTableName.customChat, [
          { name: 'title', type: 'VARCHAR(255)', nullable: true },
          { name: 'system_prompt', type: 'TEXT', nullable: true },
          { name: 'avatar', type: 'VARCHAR(255)', nullable: true },
          { name: 'model', type: 'VARCHAR(255)', nullable: true },
          { name: 'temperature', type: 'VARCHAR(20)', nullable: true },
          { name: 'context_num', type: 'INTEGER', nullable: true },
          { name: 'tts_voice', type: 'VARCHAR(255)', nullable: true },
          { name: 'font_size', type: 'INTEGER', nullable: true },
        ]),
      },
      {
        // t-custom-message
        statement: dbGenerateCreateTableStatement(DBTableName.customMessage, [
          { name: 'chat_id', type: 'INTEGER', nullable: true },
          { name: 'role', type: 'VARCHAR(50)', nullable: true },
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
