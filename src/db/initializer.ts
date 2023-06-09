import { dbExecuteSqlList } from './manager'
import { DBTableName } from './table-names'
import { DBSqlExcution, DBTableColumn } from './types'
import { dbGenCreateTableExcution } from './utils'

const EXTRA_DB_TABLE_COLUMNS: DBTableColumn[] = [
  { name: 'extra1', type: 'VARCHAR(50)', nullable: true },
  { name: 'extra2', type: 'VARCHAR(255)', nullable: true },
  { name: 'extra3', type: 'TEXT', nullable: true },
]

const dbGenCustomChatMessageInsertTriggerExcution = (): DBSqlExcution => {
  const update = `UPDATE ${DBTableName.customChat} SET latest_message_id = new.id, latest_message_content = new.content, latest_message_time = DATETIME('NOW','LOCALTIME') WHERE id = new.chat_id;`
  return {
    statement: `CREATE TRIGGER IF NOT EXISTS custom_chat_message_insert AFTER INSERT ON ${DBTableName.customChatMessage} BEGIN ${update} END;`,
  }
}

export async function dbInitTables(): Promise<void> {
  try {
    await dbExecuteSqlList([
      // t-test
      dbGenCreateTableExcution(DBTableName.test, [
        { name: 'value', type: 'TEXT', nullable: true },
        { name: 'done', type: 'CHAR(1)', nullable: true },
      ]),
      // t-mode-result
      dbGenCreateTableExcution(DBTableName.modeResult, [
        { name: 'mode', type: 'VARCHAR(50)', nullable: false, defaultValue: '' },
        { name: 'target_lang', type: 'VARCHAR(50)', nullable: false, defaultValue: '' },
        { name: 'system_prompt', type: 'TEXT', nullable: false, defaultValue: '' },
        { name: 'user_prompt_prefix', type: 'TEXT', nullable: false, defaultValue: '' },
        { name: 'user_prompt_suffix', type: 'TEXT', nullable: false, defaultValue: '' },
        { name: 'user_content', type: 'TEXT', nullable: false, defaultValue: '' },
        { name: 'assistant_content', type: 'TEXT', nullable: false, defaultValue: '' },
        { name: 'collected', type: 'CHAR(1)', nullable: false, defaultValue: '0' },
        { name: 'type', type: 'CHAR(1)', nullable: false, defaultValue: '0' },
        { name: 'status', type: 'CHAR(1)', nullable: true },
        ...EXTRA_DB_TABLE_COLUMNS,
      ]),
      // t-mode-chat-message
      dbGenCreateTableExcution(DBTableName.modeChatMessage, [
        { name: 'result_id', type: 'INTEGER', nullable: false, defaultValue: -1 },
        { name: 'role', type: 'VARCHAR(50)', nullable: false, defaultValue: '' },
        { name: 'content', type: 'TEXT', nullable: false, defaultValue: '' },
        { name: 'content_supplements', type: 'TEXT', nullable: true },
        { name: 'directive', type: 'VARCHAR(255)', nullable: true },
        { name: 'status', type: 'CHAR(1)', nullable: true },
        ...EXTRA_DB_TABLE_COLUMNS,
      ]),
      // t-custom-chat (all nullable)
      dbGenCreateTableExcution(DBTableName.customChat, [
        { name: 'avatar', type: 'VARCHAR(255)', nullable: true },
        { name: 'chat_name', type: 'TEXT', nullable: true },
        { name: 'system_prompt', type: 'TEXT', nullable: true },
        { name: 'model', type: 'VARCHAR(255)', nullable: true },
        { name: 'temperature', type: 'INTEGER', nullable: true },
        { name: 'top_p', type: 'INTEGER', nullable: true },
        { name: 'max_tokens', type: 'INTEGER', nullable: true },
        { name: 'context_messages_num', type: 'INTEGER', nullable: true },
        { name: 'tts_voice', type: 'VARCHAR(255)', nullable: true },
        { name: 'font_size', type: 'INTEGER', nullable: true },
        { name: 'pinned', type: 'CHAR(1)', nullable: true },
        { name: 'archived', type: 'CHAR(1)', nullable: true },
        { name: 'md', type: 'CHAR(1)', nullable: true },
        { name: 'latest_message_id', type: 'INTEGER', nullable: true },
        { name: 'latest_message_content', type: 'TEXT', nullable: true },
        { name: 'latest_message_time', type: 'TIMESTAMP', nullable: true },
        { name: 'status', type: 'CHAR(1)', nullable: true },
        ...EXTRA_DB_TABLE_COLUMNS,
      ]),
      // t-custom-chat-message
      dbGenCreateTableExcution(DBTableName.customChatMessage, [
        { name: 'chat_id', type: 'INTEGER', nullable: false, defaultValue: -1 },
        { name: 'role', type: 'VARCHAR(50)', nullable: false, defaultValue: '' },
        { name: 'content', type: 'TEXT', nullable: false, defaultValue: '' },
        { name: 'content_supplements', type: 'TEXT', nullable: true },
        { name: 'directive', type: 'VARCHAR(255)', nullable: true },
        { name: 'status', type: 'CHAR(1)', nullable: true },
        ...EXTRA_DB_TABLE_COLUMNS,
      ]),
      // trigger: custom_chat_message_insert
      dbGenCustomChatMessageInsertTriggerExcution(),
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
