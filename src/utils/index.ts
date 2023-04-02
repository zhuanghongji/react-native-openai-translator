export function trimContent(content: string | null | undefined) {
  if (!content) {
    return ''
  }
  return content.replace(/^[\s\n\t]+|[\s\n\t]+$/g, '')
}
