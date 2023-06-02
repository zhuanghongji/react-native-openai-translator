import { TCustomChatBasic, TResultExtra } from './types'

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
  md: null,
  latest_message_id: null,
  latest_message_content: null,
  latest_message_time: null,
  status: null,
}
