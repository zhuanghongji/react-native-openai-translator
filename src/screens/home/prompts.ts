import {
  LanguageKey,
  TranslateMode,
  languageLabelByKey,
} from '../../preferences/options'
import { isChineseLang, isEnglishWord } from '../../utils'
import { useMemo } from 'react'

export interface ChatCompletionsPrompts {
  systemPrompt: string
  systemRequires?: string[]
  userPrompt: string
}

export interface ChatCompletionsPromptsOptions {
  fromLang: LanguageKey | null
  targetLang: LanguageKey
  translateMode: TranslateMode
  userContent: string
}

export interface GenerateSpecificPromptsOptions {
  fromLang: LanguageKey | null
  targetLang: LanguageKey
  fromLangLabel: string
  targetLangLabel: string
  fromChinese: boolean
  targetChinese: boolean
  userContent: string
}

export function generatePrompts(
  options: ChatCompletionsPromptsOptions
): ChatCompletionsPrompts {
  const { fromLang, targetLang, translateMode, userContent } = options
  const os: GenerateSpecificPromptsOptions = {
    fromLang,
    targetLang,
    fromLangLabel: languageLabelByKey(fromLang),
    targetLangLabel: languageLabelByKey(targetLang),
    fromChinese: isChineseLang(fromLang),
    targetChinese: isChineseLang(targetLang),
    userContent,
  }
  switch (translateMode) {
    case 'translate':
      return generatePromptsOfTranslate(os)
    case 'polishing':
      return generatePromptsOfPolishing(os)
    case 'summarize':
      return generatePromptsOfSummarize(os)
    case 'analyze':
      return generatePromptsOfAnalyze(os)
    case 'explain-code':
      return generatePromptsOfExplainCode(os)
    default:
      return { systemPrompt: '', userPrompt: '' }
  }
}

function generatePromptsOfTranslate(
  os: GenerateSpecificPromptsOptions
): ChatCompletionsPrompts {
  const {
    fromLang,
    fromLangLabel,
    targetLang,
    targetLangLabel,
    fromChinese,
    targetChinese,
    userContent,
  } = os
  const systemPrompt =
    'You are a translation engine that can only translate text and cannot interpret it.'
  if (fromChinese) {
    if (targetChinese && userContent.length < 5) {
      return {
        systemPrompt: '你是一个翻译引擎。',
        systemRequires: [
          `请将给到的文本翻译成${targetLangLabel}`,
          '请列出3种（如果有）最常用翻译结果：单词或短语，并列出对应的适用语境（用中文阐述）、音标、词性、双语示例。',
          `按照下面格式用中文阐述：
<序号><单词或短语> · /<音标>
[<词性缩写>] <适用语境（用中文阐述）>
例句：<例句>(例句翻译)`,
        ],
        userPrompt: '',
      }
    }
    if (targetLang === 'zh-Hans') {
      return { systemPrompt, userPrompt: '翻译成简体白话文' }
    }
    if (targetLang === 'zh-Hant') {
      return {
        systemPrompt,
        userPrompt: '翻譯成台灣常用用法之繁體中文白話文',
      }
    }
    if (targetLang === 'wyw' || targetLang === 'yue') {
      return {
        systemPrompt,
        userPrompt: `翻译成${targetLangLabel}`,
      }
    }
    return {
      systemPrompt,
      userPrompt: `translate from ${fromLangLabel} to ${targetLangLabel}`,
    }
  }
  if (isEnglishWord(userContent) && targetChinese) {
    return {
      systemPrompt: '你是一个翻译引擎。',
      systemRequires: [
        '请将给到的文本翻译成英语，只需要翻译不需要解释。',
        '当且仅当文本只有一个单词时，请给出单词原始形态（如果有）、单词的语种、对应的音标（如果有）、所有含义（含词性）、双语示例，至少三条例句。',
        `请严格按照下面格式给到翻译结果：
<原始文本>
[<语种>] · / <单词音标>
[<词性缩写>] <中文含义>]

例句：
<序号><例句>(例句翻译)`,
      ],
      userPrompt: '',
    }
  }
  if (!fromLang) {
    return {
      systemPrompt,
      userPrompt: `translate to ${targetLangLabel}`,
    }
  }
  return {
    systemPrompt,
    userPrompt: `translate from ${fromLangLabel} to ${targetLangLabel}`,
  }
}

function generatePromptsOfPolishing(
  os: GenerateSpecificPromptsOptions
): ChatCompletionsPrompts {
  const { targetLangLabel, targetChinese } = os
  const systemPrompt =
    "You are a text summarizer, you can only summarize the text, don't interpret it."
  if (targetChinese) {
    return {
      systemPrompt,
      userPrompt: `使用 ${targetLangLabel} 语言润色此段文本`,
    }
  }
  return {
    systemPrompt,
    userPrompt: `Summarize this text in the most concise language and must use ${targetLangLabel}`,
  }
}

function generatePromptsOfSummarize(
  os: GenerateSpecificPromptsOptions
): ChatCompletionsPrompts {
  const { targetLangLabel, targetChinese } = os
  const systemPrompt =
    "You are a text summarizer, you can only summarize the text, don't interpret it."
  if (targetChinese) {
    return {
      systemPrompt,
      userPrompt: '用最简洁的语言使用中文总结此段文本',
    }
  }
  return {
    systemPrompt,
    userPrompt: `summarize this text in the most concise language and must use ${targetLangLabel} language!`,
  }
}

function generatePromptsOfAnalyze(
  os: GenerateSpecificPromptsOptions
): ChatCompletionsPrompts {
  const { targetLangLabel, targetChinese } = os
  const systemPrompt = 'You are a translation engine and grammar analyzer.'
  if (targetChinese) {
    return {
      systemPrompt,
      userPrompt: '请用中文翻译此段文本并解析原文中的语法',
    }
  }
  return {
    systemPrompt,
    userPrompt: `translate this text to ${targetLangLabel} and explain the grammar in the original text using ${targetLangLabel}`,
  }
}

function generatePromptsOfExplainCode(
  os: GenerateSpecificPromptsOptions
): ChatCompletionsPrompts {
  const { targetLangLabel, targetChinese } = os
  const systemPrompt =
    'You are a code explanation engine, you can only explain the code, do not interpret or translate it. Also, please report any bugs you find in the code to the author of the code.'
  if (targetChinese) {
    return {
      systemPrompt,
      userPrompt:
        '用最简洁的语言使用中文解释此段代码、正则表达式或脚本。如果内容不是代码，请返回错误提示。如果代码有明显的错误，请指出。',
    }
  }
  return {
    systemPrompt,
    userPrompt: `explain the provided code, regex or script in the most concise language and must use ${targetLangLabel} language! If the content is not code, return an error message. If the code has obvious errors, point them out.`,
  }
}

export function useChatCompletionsPrompts(
  options: ChatCompletionsPromptsOptions
): ChatCompletionsPrompts {
  const { fromLang, targetLang, translateMode, userContent } = options
  return useMemo(() => {
    return generatePrompts(options)
  }, [fromLang, targetLang, translateMode, userContent])
}
