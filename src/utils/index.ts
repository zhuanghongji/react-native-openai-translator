import { LanguageKey } from '../preferences/options'

export function trimContent(content: string | null | undefined) {
  if (!content) {
    return ''
  }
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
