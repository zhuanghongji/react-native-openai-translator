import { create } from 'zustand'

interface TemplateState {
  value: number
  increase: (by: number) => void
  decrease: (by: number) => void
}

export const useTemplateStore = create<TemplateState>(set => ({
  value: 0,
  increase: by => set(state => ({ value: state.value + by })),
  decrease: by => set(state => ({ value: state.value - by })),
}))
