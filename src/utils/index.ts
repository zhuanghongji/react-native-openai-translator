import { LanguageKey } from '../preferences/options'

export function trimContent(content: string | null | undefined) {
  if (!content) {
    return ''
  }
  // Match one or more whitespace characters (including space, tab, and newline characters) at the beginning or end of a string
  return content.replace(/^[\s\n\t]+|[\s\n\t]+$/g, '')
}

export function isChineseLang(lang: LanguageKey | null) {
  if (lang === null) {
    return false
  }
  const langsOfChinese: LanguageKey[] = ['zh-Hans', 'zh-Hant', 'wyw', 'yue']
  return langsOfChinese.includes(lang)
}

export function isEnglishWord(str: string) {
  // Match words consisting of 2 or more letters, the first letter can be uppercase or lowercase.
  const pattern = /^[A-Za-z][a-z]+$/
  return pattern.test(str.trim())
}

const HEXS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
export function invertColor(color: string): string {
  return color
    .split('')
    .map(hex => {
      const hexIndex = HEXS.findIndex(v => v === hex.toUpperCase())
      return hexIndex < 0 ? hex : HEXS[15 - hexIndex]
    })
    .join('')
}
