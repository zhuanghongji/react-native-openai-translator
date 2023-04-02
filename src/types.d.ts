export type MessageRole = 'system' | 'user' | 'assistant'

export type Message<T = MessageRole> = {
  role: T
  content: string
}

export type ChatMessage = {
  role: 'assistant' | 'user'
  content: string
  // time: number
}

export type ScanBlock = {
  text: string
  langs: string[]
}

export type TranslatorStatus = 'none' | 'pending' | 'failure' | 'success'
