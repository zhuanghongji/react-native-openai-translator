import { DEFAULTS } from '../preferences/defaults'
import { dbExecuteSql } from './manager'
import {
  DBSqlExcutionConditions,
  TCustomChat,
  TCustomChatBasic,
  TCustomChatDefault,
  TPageData,
  TPageParams,
  TResultExtra,
} from './types'
import { dbGenSelectNextCursorWhereLimitExecution } from './utils'

export const DEFAULT_T_RESULT_EXTRA: TResultExtra = {
  extra1: null,
  extra2: null,
  extra3: null,
}

export const DEFAULT_T_CUSTOM_CHAT_BASIC: TCustomChatBasic = {
  ...DEFAULT_T_RESULT_EXTRA,
  avatar: null,
  chat_name: null,
  system_prompt: null,
  model: null,
  temperature: null,
  top_p: null,
  max_tokens: null,
  context_messages_num: null,
  tts_voice: null,
  font_size: null,
  pinned: null,
  archived: null,
  status: null,
}

export function fillTCustomChatWithDefaults(
  id: number,
  chat: TCustomChat | undefined
): TCustomChatDefault {
  const _chat = chat ?? {
    ...DEFAULT_T_CUSTOM_CHAT_BASIC,
    id,
    insert_time: null,
    update_time: null,
  }
  return {
    ..._chat,
    id: _chat.id ?? id,
    avatar: _chat.avatar ?? DEFAULTS.avatar,
    model: _chat.model ?? DEFAULTS.apiModel,
    temperature: _chat.temperature ?? DEFAULTS.apiTemperature,
    context_messages_num: _chat.context_messages_num ?? DEFAULTS.contextMessagesNum,
    font_size: _chat.font_size ?? DEFAULTS.fontSize,
  }
}

export async function dbExecuteSelectPageable<ItemT extends { id: number }>(
  tableName: string,
  params: TPageParams,
  conditions: DBSqlExcutionConditions
): Promise<TPageData<ItemT>> {
  const { nextCursor, pageSize } = params
  try {
    const itemsResult = await dbExecuteSql<ItemT>(
      dbGenSelectNextCursorWhereLimitExecution(tableName, nextCursor, conditions, pageSize)
    )
    const items = itemsResult.rows._array
    let _nextCursor: number | null = null
    if (items.length === pageSize) {
      _nextCursor = items[items.length - 1].id
    }
    return { items, nextCursor: _nextCursor }
  } catch (e) {
    return Promise.reject(e)
  }
}
