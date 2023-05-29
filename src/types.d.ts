export type ApiMessageRole = 'system' | 'user' | 'assistant'

export type ApiMessage = {
  role: ApiMessageRole
  content: string
}

export type ChatMessageRole = 'user' | 'assistant' | 'divider'

export type ChatMessage = {
  role: ChatMessageRole
  content: string
  inContext: boolean | null
}

export type BaseMessage = {
  role: string
  content: string
}

export type ScanBlock = {
  text: string
  langs: string[]
}

export type TranslatorStatus = 'none' | 'pending' | 'failure' | 'success'
