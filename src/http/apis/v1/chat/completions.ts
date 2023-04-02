import { Message } from '../../../../types'
import { sseRequest } from '../../../sse-manager'

export interface ChatCompletion {
  id: string
  object: string
  created: number
  model: string
  choices: ChatCompletionChoice[]
}

export interface ChatCompletionChoice {
  delta: ChatCompletionChoiceDelta
  index: number
  finish_reason?: any
}

export interface ChatCompletionChoiceDelta {
  role?: string
  content?: string
}

export interface ChatCompletionsOptions {
  apiUrl: string
  apiUrlPath: string
  apiKey: string
  messages: Message[]
}

export interface ChatCompletionsCallbacks {
  onSubscribe: () => void
  onNext: (content: string) => void
  onDone: (result: Message) => void
  onTimeout: () => void
  onError: (message: string) => void
  onComplete: () => void
}

/**
 * Docs: https://platform.openai.com/docs/api-reference/completions
 */
export function sseRequestChatCompletions(
  options: ChatCompletionsOptions,
  callbacks: ChatCompletionsCallbacks
) {
  const { apiUrl, apiUrlPath, apiKey, messages } = options
  const { onSubscribe, onNext, onDone, onTimeout, onError, onComplete } =
    callbacks

  const result: Message<string> = { role: '', content: '' }
  const es = sseRequest(
    `${apiUrl}${apiUrlPath}`,
    {
      method: 'POST',
      apiKey,
      data: {
        model: 'gpt-3.5-turbo',
        temperature: 0,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1,
        stream: true,
        messages,
      },
    },
    {
      onOpen: onSubscribe,
      onMessage: data => {
        console.log('onMessage', data)
        if (!data) {
          return
        }
        if (data === '[DONE]') {
          es.close()
          onDone(result as Message)
          onComplete()
          return
        }
        const item = JSON.parse(data) as ChatCompletion
        for (const choice of item.choices) {
          const { role, content } = choice.delta
          if (role) {
            result.role += role
          }
          if (content) {
            result.content += content
            onNext(result.content)
          }
        }
      },
      onTimeout: () => {
        onTimeout()
        onComplete()
      },
      onError: message => {
        onError(message)
        onComplete()
      },
      onException: message => {
        onError(message)
        onComplete()
      },
    }
  )
}
