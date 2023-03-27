import { print } from '../printer'
import EventSource from 'react-native-sse'
import 'react-native-url-polyfill/auto'

const TAG = 'SSEManager'

// export function requestSSE(content: string) {
//   const es = new EventSource('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization:
//         'Bearer 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',
//     },
//     body: JSON.stringify({
//       model: 'gpt-3.5-turbo',
//       temperature: 0,
//       max_tokens: 1000,
//       top_p: 1,
//       frequency_penalty: 1,
//       presence_penalty: 1,
//       stream: true,
//       messages: [
//         {
//           role: 'system',
//           content: `你是一个翻译引擎，请将给到的文本翻译成中文。请列出3种（如果有）最常用翻译结果：单词或短语，并列出对应的适用语境（用中文阐述）、音标、词性、双语示例。按照下面格式用中文阐述：
//             <序号><单词或短语> · /<音标>
//             [<词性缩写>] <适用语境（用中文阐述）>
//             例句：<例句>(例句翻译)`,
//         },
//         {
//           role: 'user',
//           content: `${content}`,
//         },
//       ],
//     }),
//   })

//   es.addEventListener('open', event => {
//     console.log('Open SSE connection.')
//   })

//   es.addEventListener('message', event => {
//     // console.log('New message1 event:', event)
//     if (event.type !== 'message') {
//       return
//     }
//     const { data } = event
//     if (!data) {
//       return
//     }
//     if (data === '[DONE]') {
//       console.log('sse message done')
//       es.close()
//       return
//     }
//     const _data = JSON.parse(data) as ChatCompletion
//     console.log(
//       'sse message content: ' + _data.choices[0].delta.content ?? '--'
//     )
//   })

//   // es.addEventListener('data', event => {
//   //   console.log('New data event:', event)
//   // })

//   es.addEventListener('error', event => {
//     if (event.type === 'error') {
//       console.error('Connection error:', event.message)
//     } else if (event.type === 'exception') {
//       console.error('Error:', event.message, event.error)
//     }
//   })

//   es.addEventListener('close', event => {
//     console.log('Close SSE connection.')
//   })

//   // es.dispatch(type, data => {
//   //   console.log('Close SSE connection.')
//   // })
// }

export function sseRequest(
  url: string,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    apiKey: string
    data: { [key: string]: any }
  },
  callbacks: {
    onOpen?: () => void
    onMessage: (data: string) => void
    onTimeout?: () => void
    onError?: (message: string) => void
    onException?: (message: string, error: Error) => void
    onClose?: () => void
  }
) {
  const { method, apiKey, data } = options
  const es = new EventSource(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  })

  const { onOpen, onMessage, onTimeout, onError, onException, onClose } =
    callbacks
  es.addEventListener('open', () => {
    print(TAG, 'onOpen')
    onOpen?.()
  })

  es.addEventListener('message', event => {
    print(TAG, 'onMessage')
    if (event.type !== 'message' || !event.data) {
      return
    }
    const { data: eventData } = event
    onMessage(eventData)
  })

  es.addEventListener('error', event => {
    if (event.type === 'timeout') {
      print(TAG, 'onTimeout')
      onTimeout?.()
      return
    }
    if (event.type === 'error') {
      print(TAG, 'onError')
      onError?.(event.message)
      return
    }
    if (event.type === 'exception') {
      print(TAG, 'onException')
      onException?.(event.message, event.error)
      return
    }
    print(TAG, 'unknown error')
  })

  es.addEventListener('close', () => {
    print(TAG, 'onClose')
    onClose?.()
  })

  return es
}
