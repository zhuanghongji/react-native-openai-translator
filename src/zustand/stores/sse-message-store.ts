import { create } from 'zustand'

type SSEMessageStatus = 'none' | 'sending' | 'complete'

interface SSEMessageState {
  status: SSEMessageStatus
  setStatus: (status: SSEMessageStatus) => void
  content: string
  setContent: (content: string) => void
}

export const useSSEMessageStore = create<SSEMessageState>(set => ({
  status: 'none',
  setStatus: status => set(_ => ({ status })),
  content: '',
  setContent: content => set(_ => ({ content })),
}))
