import { LanguageKey, TranslatorMode, languageLabelByKey } from '../../../preferences/options'
import { Message } from '../../../types'
import { isChineseLang, isEnglishWord } from '../../../utils'
import { useMemo } from 'react'

const ENGLISH_WORD_CHINESE_PREFIX = `所需格式：：
<输入单词>
[<语种>] · / <单词音标>
[<词性缩写>] <中文含义>]

例句：
<序号><例句>\n(例句翻译)

输入单词："""\n`
const ENGLISH_WORD_CHINESE_SUFFIX =
  '\n"""\n\n请将翻译输入单词，不需要额外解释，同时给出单词原始形态、单词的语种、对应的音标、所词性的中文含义、三个双语示例句子：'

export interface ChatCompletionsPrompts {
  systemPrompt: string
  userPromptPrefix?: string
  userPromptSuffix?: string
}

export interface ChatCompletionsPromptsOptions {
  targetLang: LanguageKey
  translatorMode: TranslatorMode
  inputText: string
}

export interface GenerateSpecificPromptsOptions {
  targetLang: LanguageKey
  targetLangLabel: string
  targetChinese: boolean
  inputText: string
}

export function generatePrompts(options: ChatCompletionsPromptsOptions): ChatCompletionsPrompts {
  const { targetLang, translatorMode, inputText } = options
  const targetLangLabel = languageLabelByKey(targetLang)
  const os: GenerateSpecificPromptsOptions = {
    targetLang,
    targetLangLabel,
    targetChinese: isChineseLang(targetLang),
    inputText,
  }
  switch (translatorMode) {
    case 'translate':
      return generatePromptsOfTranslate(os)
    case 'polishing':
      return generatePromptsOfPolishing(os)
    case 'summarize':
      return generatePromptsOfSummarize(os)
    case 'analyze':
      return generatePromptsOfAnalyze(os)
    default:
      return { systemPrompt: '', userPromptPrefix: `Language of reply: ${targetLangLabel}\n` }
  }
}
function generatePromptsOfTranslate(os: GenerateSpecificPromptsOptions): ChatCompletionsPrompts {
  const { targetLang, targetLangLabel, targetChinese, inputText } = os
  let systemPrompt = 'Act as a language translation engine'
  const userPromptPrefix = `Translate the following text into ${targetLangLabel} without explaining it:`

  // targetChinese
  if (targetChinese) {
    if (isEnglishWord(inputText)) {
      return {
        systemPrompt: '作为一个英语翻译引擎',
        userPromptPrefix: ENGLISH_WORD_CHINESE_PREFIX,
        userPromptSuffix: ENGLISH_WORD_CHINESE_SUFFIX,
      }
    }
    systemPrompt = '作为一个语言翻译引擎'
    if (targetLang === 'zh-Hans') {
      return {
        systemPrompt,
        userPromptPrefix: '将下面的内容翻译成简体白话文：\n\n',
      }
    }
    if (targetLang === 'zh-Hant') {
      return {
        systemPrompt,
        userPromptPrefix: '將下面的內容翻譯成臺灣常用的繁體白話文：\n\n',
      }
    }
    if (targetLang === 'wyw') {
      return {
        systemPrompt,
        userPromptPrefix: '将下面的内容翻译成中国的古文：\n\n',
      }
    }
    if (targetLang === 'yue') {
      return {
        systemPrompt,
        userPromptPrefix: '將下面的內容翻譯成粵語：\n\n',
      }
    }
    return {
      systemPrompt,
      userPromptPrefix,
    }
  }
  // others
  return {
    systemPrompt,
    userPromptPrefix,
  }
}

function generatePromptsOfPolishing(os: GenerateSpecificPromptsOptions): ChatCompletionsPrompts {
  const { targetLang, targetLangLabel, targetChinese } = os
  const systemPrompt = 'Act as an sentences polish engine'
  const userPromptPrefix = `Revise the following text into ${targetLangLabel} and make them more clear, concise, and coherent:`
  if (targetChinese) {
    if (targetLang === 'zh-Hant' || targetLang === 'yue') {
      return {
        systemPrompt: '作為一個語句潤色引擎',
        userPromptPrefix: '用繁体中文來润色這段文本：\n\n',
      }
    }
    return {
      systemPrompt: '作为一个语句润色引擎',
      userPromptPrefix: '使用中文来润色这段文本：\n\n',
    }
  }
  return { systemPrompt, userPromptPrefix }
}

function generatePromptsOfSummarize(os: GenerateSpecificPromptsOptions): ChatCompletionsPrompts {
  const { targetLang, targetLangLabel, targetChinese } = os
  const systemPrompt = 'Act as a text summarizer'
  const userPromptPrefix = `Summarize the following text into ${targetLangLabel} and make thme more concise, without interpretion:`
  if (targetChinese) {
    if (targetLang === 'zh-Hant' || targetLang === 'yue') {
      return {
        systemPrompt: '作為一個文本總結器',
        userPromptPrefix: '請用最簡潔的繁体中文總結這段文本：\n\n',
      }
    }
    return {
      systemPrompt: '作为一个文本总结器',
      userPromptPrefix: '请用最简洁的中文语言总结这段文本：\n\n',
    }
  }
  return { systemPrompt, userPromptPrefix }
}

function generatePromptsOfAnalyze(os: GenerateSpecificPromptsOptions): ChatCompletionsPrompts {
  const { targetLang, targetLangLabel, targetChinese } = os
  const systemPrompt = 'Act as a translation engine and grammar analyzer'
  const userPromptPrefix = `Translate the following text into ${targetLangLabel} and explain the grammar in the original text with ${targetLangLabel}:`
  if (targetChinese) {
    if (targetLang === 'zh-Hant' || targetLang === 'yue') {
      return {
        systemPrompt: '作為一個語言翻譯引擎和語法分析器',
        userPromptPrefix: '請將下面的文本翻譯成繁體中文，並解析原文本的語法：\n\n',
      }
    }
    return {
      systemPrompt: '作为一个翻译引擎和语法分析器',
      userPromptPrefix: '请将下面的文本翻译成简体中文，并解析原文本的语法：\n\n',
    }
  }
  return { systemPrompt, userPromptPrefix }
}

export function generateMessagesWithPrompts(options: ChatCompletionsPromptsOptions): {
  messages: Message[]
  prompts: ChatCompletionsPrompts
  systemContent: string
  finalUserContent: string
} {
  const prompts = generatePrompts(options)
  const { inputText } = options
  const { systemPrompt, userPromptPrefix, userPromptSuffix } = prompts

  const messages: Message[] = []
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }
  const finalUserContent = [userPromptPrefix, inputText, userPromptSuffix]
    .filter(v => (v ? true : false))
    .join('')
  messages.push({ role: 'user', content: finalUserContent })

  return { messages, prompts, systemContent: systemPrompt, finalUserContent }
}

export function useMessagesWithPrompts(options: ChatCompletionsPromptsOptions) {
  const { targetLang, translatorMode, inputText } = options
  return useMemo(() => {
    return generateMessagesWithPrompts({
      targetLang,
      translatorMode,
      inputText,
    })
  }, [targetLang, translatorMode, inputText])
}
