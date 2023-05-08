export type DiscoverChunk =
  | {
      type: 'group-divider'
    }
  | {
      type: 'group-text'
      value: string
    }
  | {
      type: 'item'
      title: string
      content: string
      filterText?: string
    }
  | {
      type: 'empty'
    }
