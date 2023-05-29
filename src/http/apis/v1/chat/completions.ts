import { texts } from '../../../../res/texts'
import { ApiMessage, BaseMessage } from '../../../../types'
import { sseRequest } from '../../../sse-manager'
import { OpenAIApiUrlOptions } from '../../type'
import EventSource from 'react-native-sse'

/**
 * {
 *   code: "invalid_api_key"
 *   message: "Incorrect API key provided: sk-kf0H0***PLVW. You can find your API key at https://platform.openai.com/account/api-keys."
 *   param: null
 *   type: "invalid_request_error"
 * }
 */
export interface ChatCompletionError {
  error: {
    code: string
    message: string
    param: string
    type: string
  }
}

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

export interface ChatCompletionsCustomizedOptions {
  model?: string
  temperature?: number
}

export interface ChatCompletionsCallbacks {
  onSubscribe?: () => void
  onNext: (content: string) => void
  onDone: (result: ApiMessage) => void
  onError: (code: string, message: string) => void
  onComplete?: () => void
}

const LastAPIKeyChunkRef = { current: '' }
function parseAPIKeyChunk(apiKey: string): string {
  if (!apiKey || !apiKey.trim()) {
    return ''
  }
  const chunks = apiKey
    .split(',')
    .map(v => v.trim())
    .filter(v => (v ? true : false))
  const lastChunkIndex = chunks.indexOf(LastAPIKeyChunkRef.current)
  if (lastChunkIndex < 0) {
    return chunks[0]
  }
  const chunk = chunks[(lastChunkIndex + 1) % chunks.length]
  LastAPIKeyChunkRef.current = chunk
  return chunk
}

/**
 * Docs: https://platform.openai.com/docs/api-reference/completions
 */
export function sseRequestChatCompletions(
  urlOptions: OpenAIApiUrlOptions,
  customizedOptions: ChatCompletionsCustomizedOptions,
  messages: ApiMessage[],
  callbacks: ChatCompletionsCallbacks
): EventSource {
  const { apiUrl, apiUrlPath, apiKey } = urlOptions
  const { onSubscribe, onNext, onDone, onError, onComplete } = callbacks

  const result: BaseMessage = { role: '', content: '' }
  const es = sseRequest(
    `${apiUrl}${apiUrlPath}`,
    {
      method: 'POST',
      apiKey: parseAPIKeyChunk(apiKey),
      data: {
        model: 'gpt-3.5-turbo',
        temperature: 0,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1,
        stream: true,
        ...customizedOptions,
        messages,
      },
    },
    {
      onOpen: onSubscribe,
      onMessage: data => {
        if (!data) {
          return
        }
        if (data === '[DONE]') {
          es.close()
          onDone(result as ApiMessage)
          onComplete?.()
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
        onError(texts.requestTimeout, texts.checkNetworkOrSettings)
        onComplete?.()
      },
      onError: message => {
        try {
          if (typeof message === 'string') {
            const { error } = JSON.parse(message) as ChatCompletionError
            onError(error.code, error.message)
          } else {
            const { error } = message as ChatCompletionError
            onError(error.code, error.message)
          }
        } catch (e) {
          onError(texts.requestError, texts.checkNetworkOrSettings)
        }
        onComplete?.()
      },
      onException: () => {
        onError(texts.requestError, texts.checkNetworkOrSettings)
        onComplete?.()
      },
    }
  )

  return es
}
