export type TranslatorMode =
  | 'translate'
  | 'polishing'
  | 'summarize'
  | 'analyze'
  | 'explain-code'

export type TranslatorStatus = 'fetching' | 'success' | 'error'
