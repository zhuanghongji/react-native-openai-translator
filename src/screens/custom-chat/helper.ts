import { ApiMessage, ChatMessage } from '../../types'

export function generateMessagesToSend(options: {
  systemPrompt: string | null
  currentMessages: ChatMessage[]
  userMessageContent: string
}): ApiMessage[] {
  const { systemPrompt, currentMessages, userMessageContent } = options
  const result: ApiMessage[] = []
  for (const msg of currentMessages) {
    if (msg.inContext !== true) {
      break
    }
    if (msg.role === 'user') {
      result.unshift({ role: 'user', content: msg.content })
      continue
    }
    if (msg.role === 'assistant') {
      result.unshift({ role: 'assistant', content: msg.content })
      continue
    }
    // nothing
  }
  if (systemPrompt) {
    result.unshift({ role: 'system', content: systemPrompt })
  }
  result.push({ role: 'user', content: userMessageContent })
  return result
}
