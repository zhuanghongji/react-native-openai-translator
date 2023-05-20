import { TCustomChat } from '../../db/types'
import { create } from 'zustand'

type CustomChatById = { [id: string]: TCustomChat }

interface CustomChatSettings {
  chatById: CustomChatById
  batchChat: (chats: TCustomChat[]) => void
  updateChat: (id: number, chat: Partial<TCustomChat>) => void
}

export const useCustomChatSettingsStore = create<CustomChatSettings>(set => ({
  chatById: {},
  batchChat: chats =>
    set(state => {
      const nextChatsById: CustomChatById = {}
      for (const chat of chats) {
        nextChatsById[`${chat.id}`] = chat
      }
      return { chatById: { ...state.chatById, ...nextChatsById } }
    }),
  updateChat: (id, chat) =>
    set(state => {
      const key = `${id}`
      const prevChat = state.chatById[key]
      if (!prevChat) {
        return state
      }
      return { chatById: { ...state.chatById, [key]: { ...prevChat, ...chat } } }
    }),
}))
