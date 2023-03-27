export type MessageRole = 'system' | 'user' | 'assistant'

export type Message<T = MessageRole> = {
  role: T
  content: string
}

export type Messages<T = MessageRole> = Message<T>[]

export type TranslatorStatus = 'fetching' | 'success' | 'error'
