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

/**
 * Standby column
 */
export interface TResultExtra {
  extra1: string | null
  extra2: string | null
  extra3: string | null
}

// MARK: TModeResult

export type TModeResultBasic = TResultExtra & {
  mode: string
  target_lang: string
  system_prompt: string
  user_prompt_prefix: string
  user_prompt_suffix: string
  user_content: string
  assistant_content: string
  collected: string
  /**
   * '0': normal result
   * '1': english-word result
   */
  type: string
  status: string | null
}

export type TModeResult = TResultBase & TModeResultBasic

// MARK: TModeChatMessage

export type TModeChatMessageBasic = TResultExtra & {
  result_id: number
  role: string
  content: string
  status: string | null
}

export type TModeChatMessage = TResultBase & TModeChatMessageBasic

// MARK: TCustomChat
export type TCustomChatBasic = TResultExtra & {
  avatar: string | null
  chat_name: string | null
  system_prompt: string | null
  model: string | null
  temperature: number | null
  top_p: number | null
  max_tokens: number | null
  context_messages_num: number | null
  tts_voice: string | null
  font_size: number | null
  status: string | null
}

export type TCustomChat = TResultBase & TCustomChatBasic

export type TCustomChatDefault = RemoveNullByKey<
  TCustomChat,
  'id' | 'avatar' | 'model' | 'temperature' | 'context_messages_num' | 'font_size'
>

// MARK: TCustomChatMessage

export type TCustomChatMessageBasic = TResultExtra & {
  chat_id: number
  role: string
  content: string
  status: string | null
}

export type TCustomChatMessage = TResultBase & TCustomChatMessageBasic

// MARK: Utility

export type RemoveNull<T> = {
  [K in keyof T]: Exclude<T[K], null>
}

export type RemoveNullByKey<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? Exclude<T[P], null> : T[P]
}

// MARK: SQL

export type DBSqlExcutionArgs = (number | string | null)[]
export type DBSqlExcutionValues = { [key: string]: string | number | null }
export type DBSqlExcutionConditions = { [key: string]: string | number | null }

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

export interface TPageParams {
  /** null: first page  */
  nextCursor: number | null
  pageSize: number
}

export interface TPageData<ItemT> {
  /** null: no more page  */
  nextCursor: number | null
  items: ItemT[]
}
