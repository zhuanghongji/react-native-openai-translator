import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TResultBase } from '../types'
import { dbGenInsertExecution, dbGenSelectExecution, dbGenSelectWhereExecution } from '../utils'

const TABLE_NAME = DBTableName.customChat

export interface TCustomChat extends TResultBase {
  title: string
  system_prompt: string
  avatar: string
  model: string
  temperature: string
  context_num: number
  tts_voice: string
  font_size: number
}

export const DEFAULT_CUSTOM_CHAT: Omit<TCustomChat, keyof TResultBase> = {
  title: '',
  system_prompt: '',
  avatar: '',
  model: '',
  temperature: '',
  context_num: 4,
  tts_voice: '',
  font_size: 15,
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
