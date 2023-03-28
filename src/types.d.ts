export type MessageRole = 'system' | 'user' | 'assistant'

export type Message<T = MessageRole> = {
  role: T
  content: string
}

export type TranslatorStatus = 'none' | 'pending' | 'failure' | 'success'
