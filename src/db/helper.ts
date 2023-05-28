import { DEFAULTS } from '../preferences/defaults'
import { print } from '../printer'
import { DEFAULT_T_CUSTOM_CHAT_BASIC, DEFAULT_T_RESULT_EXTRA } from './constants'
import { dbInsertCustomChatMessage } from './table/t-custom-chat-message'
import { dbInsertModeChatMessage } from './table/t-mode-chat-message'
import {
  TCustomChat,
  TCustomChatDefault,
  TCustomChatMessageBasic,
  TModeChatMessageBasic,
} from './types'

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
    insert_time: _chat.insert_time ?? '',
    update_time: _chat.update_time ?? '',
  }
}

export function dbInsertModeChatMessageSimply(
  params: Pick<TModeChatMessageBasic, 'result_id' | 'role' | 'content'>
) {
  dbInsertModeChatMessage({
    ...DEFAULT_T_RESULT_EXTRA,
    content_supplements: null,
    directive: null,
    status: null,
    ...params,
  })
    .then(result => {
      print('dbInsertModeChatMessageSimply, success = ', { params, result })
    })
    .catch(e => {
      print('dbInsertModeChatMessageSimply, error = ', { params, e })
    })
}

export function dbInsertCustomChatMessageSimply(
  params: Pick<TCustomChatMessageBasic, 'chat_id' | 'role' | 'content'>
) {
  dbInsertCustomChatMessage({
    ...DEFAULT_T_RESULT_EXTRA,
    content_supplements: null,
    directive: null,
    status: null,
    ...params,
  })
    .then(result => {
      print('dbInsertCustomChatMessageSimply, success = ', { params, result })
    })
    .catch(e => {
      print('dbInsertCustomChatMessageSimply, error = ', { params, e })
    })
}
