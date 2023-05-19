import { TCustomChat, T_CUSTOM_CHAT_DEFAULT } from '../../db/table/t-custom-chat'
import { useCustomChatSettingsStore } from './custom-chat-settings'

const customChatSettingsState = useCustomChatSettingsStore.getState()

export function updateCustomChatSettings(id: number, chat: Partial<TCustomChat>) {
  customChatSettingsState.updateChat(id, chat)
  // TODO Update SQLite
}

export function useCustomChatSettings(id: number): TCustomChat {
  const chatById = useCustomChatSettingsStore(state => state.chatById)
  return chatById[`${id}`] ?? { id, ...T_CUSTOM_CHAT_DEFAULT }
}
