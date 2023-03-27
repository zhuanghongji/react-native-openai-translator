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

/**
 * Docs: https://platform.openai.com/docs/api-reference/completions
 */
export function sseRequestChatCompletions(
  options: {
    url: string
    userContent: string
    apiKey: string
  },
  callbacks: {
    onSubscribe: () => void
    onNext: (content: string) => void
    onDone: (result: Message) => void
    onTimeout: () => void
    onError: (message: string) => void
    onComplete: () => void
  }
) {
  const { url, userContent, apiKey } = options
  const { onSubscribe, onNext, onDone, onTimeout, onError, onComplete } =
    callbacks

  const result: Message<string> = { role: '', content: '' }
  const es = sseRequest(
    url,
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
        messages: [
          {
            role: 'system',
            content: `你是一个翻译引擎，请将给到的文本翻译成中文。请列出3种（如果有）最常用翻译结果：单词或短语，并列出对应的适用语境（用中文阐述）、音标、词性、双语示例。按照下面格式用中文阐述：
            <序号><单词或短语> · /<音标>
            [<词性缩写>] <适用语境（用中文阐述）>
            例句：<例句>(例句翻译)`,
          },
          {
            role: 'user',
            content: `"${userContent}"`,
          },
        ],
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
            // print('zhuanghj', 'onNext', { resultContent: result.content })
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
