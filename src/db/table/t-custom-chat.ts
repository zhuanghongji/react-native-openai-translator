import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TResultBase } from '../types'
import { dbGenInsertExecution, dbGenSelectExecution, dbGenSelectWhereExecution } from '../utils'

const TABLE_NAME = DBTableName.customChat

export type TCustomChatBasic = {
  avatar: string | null
  name: string | null
  system_prompt: string | null
  model: string | null
  // TODO must change to number type
  temperature: string | null
  // TODO Is it need to change to context_message_num ?
  context_num: number | null
  tts_voice: string | null
  font_size: number | null
}

export type TCustomChat = TResultBase & TCustomChatBasic

export const T_CUSTOM_CHAT_BASIC_DEFAULT = {
  avatar: '😀',
  model: 'gpt-3.5-turbo',
  temperature: '1.0',
  context_num: 4,
  font_size: 16,
}

export const T_CUSTOM_CHAT_DEFAULT: Omit<TCustomChat, 'id'> = {
  avatar: null,
  name: null,
  system_prompt: null,
  model: null,
  temperature: null,
  context_num: null,
  tts_voice: null,
  font_size: null,
  insert_time: null,
  update_time: null,
}

export function dbInsertCustomChat(target: Omit<TCustomChat, keyof TResultBase>) {
  return dbExecuteSql<TCustomChat>(dbGenInsertExecution(TABLE_NAME, target))
}

export function dbFindCustomChatById(id: number) {
  return dbExecuteSql<TCustomChat>(dbGenSelectWhereExecution(TABLE_NAME, { id }))
}

export function dbSelectCustomChat() {
  return dbExecuteSql<TCustomChat>(dbGenSelectExecution(TABLE_NAME))
}
