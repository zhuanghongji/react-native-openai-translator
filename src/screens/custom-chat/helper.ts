import { ChatMessage, Message } from '../../types'

export function generateMessagesToSend(options: {
  systemPrompt: string | null
  contextMessagesNum: number
  currentMessages: ChatMessage[]
  newMessage: Message
}): Message[] {
  const { systemPrompt, contextMessagesNum, currentMessages, newMessage } = options
  const result: Message[] = []
  for (const msg of currentMessages) {
    if (result.length >= contextMessagesNum) {
      break
    }
    if (msg.role === 'divider') {
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
  result.push(newMessage)
  return result
}
