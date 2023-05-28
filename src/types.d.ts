export type ApiMessageRole = 'system' | 'user' | 'assistant'

export type ApiMessage = {
  role: ApiMessageRole
  content: string
}

export type ChatMessageRole = 'user' | 'assistant' | 'divider'

export type ChatMessage = {
  role: ChatMessageRole
  // 'FOREMOST' | 'NEW DIALOGUE' | else
  content: string
  // true: colors.in | false: colors.out | null: colors.transparent
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
