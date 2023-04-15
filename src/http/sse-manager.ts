import { print } from '../printer'
import EventSource from 'react-native-sse'
import 'react-native-url-polyfill/auto'

const TAG = 'SSEManager'

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

  const { onOpen, onMessage, onTimeout, onError, onException, onClose } = callbacks
  es.addEventListener('open', () => {
    print(TAG, 'open')
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
    setTimeout(() => es.close(), 100)
    if (event.type === 'timeout') {
      print(TAG, 'timeout')
      onTimeout?.()
      return
    }
    if (event.type === 'error') {
      print(TAG, 'error')
      onError?.(event.message)
      return
    }
    if (event.type === 'exception') {
      print(TAG, 'exception')
      onException?.(event.message, event.error)
      return
    }
    print(TAG, 'unknown error')
  })

  es.addEventListener('close', () => {
    print(TAG, 'close')
    onClose?.()
  })

  return es
}
