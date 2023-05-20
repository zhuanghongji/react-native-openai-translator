import { DEFAULTS } from '../preferences/defaults'
import { TCustomChat, TCustomChatBasic, TCustomChatDefault, TResultExtra } from './types'

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