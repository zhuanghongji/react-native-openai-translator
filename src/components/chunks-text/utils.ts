type Splitter = string | null | undefined

export type SplitToTextChunksOptions = {
  value: string
  splitter: Splitter
  maxLength?: number
}

export type SplitToTextChunksOptionsWithOffset = SplitToTextChunksOptions & {
  leftOffset: number
  rightOffset: number
}

export type TextChunks =
  | {
      splitted: false
      raw: string
    }
  | {
      splitted: true
      raw: string
      start: string
      left: string
      center: string
      right: string
      end: string
    }

export function splitToTextChunks(options: SplitToTextChunksOptions): TextChunks {
  const { value, splitter, maxLength } = options
  if (!value || !splitter) {
    return { splitted: false, raw: value }
  }
  const centerIndex = value.toLowerCase().indexOf(splitter.toLocaleLowerCase())
  if (centerIndex < 0) {
    return { splitted: false, raw: value }
  }
  const centerIndexEnd = centerIndex + splitter.length
  if (!maxLength || maxLength <= 0) {
    // substring
    const left = value.substring(0, centerIndex)
    const center = value.substring(centerIndex, centerIndexEnd)
    const right = value.substring(centerIndexEnd)
    return { splitted: true, raw: value, start: '', left, center, right, end: '' }
  }
  const remainLength = Math.max(0, maxLength - splitter.length)
  const leftOffset = Math.min(centerIndex, remainLength / 2)
  const rightOffset = remainLength - leftOffset
  // substring
  const leftIndex = Math.max(0, centerIndex - leftOffset)
  const rightIndexEnd = Math.min(centerIndex + rightOffset, value.length)
  const start = value.substring(0, leftIndex)
  const left = value.substring(leftIndex, centerIndex)
  const center = value.substring(centerIndex, centerIndexEnd)
  const right = value.substring(centerIndexEnd, rightIndexEnd)
  const end = value.substring(rightIndexEnd)
  return { splitted: true, raw: value, start, left, center, right, end }
}

export function splitToTextChunksWithOffset(
  options: SplitToTextChunksOptionsWithOffset
): TextChunks {
  const { value, splitter, leftOffset, rightOffset } = options
  if (!value || !splitter) {
    return { splitted: false, raw: value }
  }
  const centerIndex = value.toLowerCase().indexOf(splitter.toLocaleLowerCase())
  if (centerIndex < 0) {
    return { splitted: false, raw: value }
  }
  const centerIndexEnd = centerIndex + splitter.length
  // substring
  const leftIndex = Math.max(0, centerIndex - leftOffset)
  const rightIndexEnd = Math.min(centerIndex + rightOffset, value.length)
  const start = value.substring(0, leftIndex)
  const left = value.substring(leftIndex, centerIndex)
  const center = value.substring(centerIndex, centerIndexEnd)
  const right = value.substring(centerIndexEnd, rightIndexEnd)
  const end = value.substring(rightIndexEnd)
  return { splitted: true, raw: value, start, left, center, right, end }
}
