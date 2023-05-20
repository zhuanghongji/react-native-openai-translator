import { TCustomChat } from '../../db/types'
import { useCustomChatSettingsStore } from './custom-chat-settings'

const customChatSettingsState = useCustomChatSettingsStore.getState()

export function updateCustomChatSettings(id: number, chat: Partial<TCustomChat>) {
  customChatSettingsState.updateChat(id, chat)
  // TODO Update SQLite
}

export function useCustomChatSettings(id: number): TCustomChat | undefined {
  const chatById = useCustomChatSettingsStore(state => state.chatById)
  return chatById[`${id}`]
}
