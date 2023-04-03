import {
  LanguageKey,
  TranslatorMode,
  languageLabelByKey,
} from '../../preferences/options'
import { Message } from '../../types'
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
  translatorMode: TranslatorMode
  inputText: string
}

export interface GenerateSpecificPromptsOptions {
  fromLang: LanguageKey | null
  targetLang: LanguageKey
  fromLangLabel: string
  targetLangLabel: string
  fromChinese: boolean
  targetChinese: boolean
  inputText: string
}

export function generatePrompts(
  options: ChatCompletionsPromptsOptions
): ChatCompletionsPrompts {
  const { fromLang, targetLang, translatorMode, inputText } = options
  const os: GenerateSpecificPromptsOptions = {
    fromLang,
    targetLang,
    fromLangLabel: languageLabelByKey(fromLang),
    targetLangLabel: languageLabelByKey(targetLang),
    fromChinese: isChineseLang(fromLang),
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
      return { systemPrompt: '', userPrompt: '' }
  }
}

function generatePromptsOfTranslate(
  os: GenerateSpecificPromptsOptions
): ChatCompletionsPrompts {
  const {
    fromLang,
    targetLang,
    targetLangLabel,
    fromChinese,
    targetChinese,
    inputText,
  } = os
  let systemPrompt =
    'You are a translation engine that can only translate text and cannot interpret it.'
  const userPrompt = `Translate the content below to ${targetLangLabel} :`

  if (fromLang === 'wyw' && targetChinese) {
    if (targetLang === 'wyw') {
      return {
        systemPrompt: '你是一个中国诗词专家。',
        userPrompt:
          '假设你是下面的文本的原作者，再写一句同样含义、同样字数的诗词：',
      }
    }
    if (targetLang === 'zh-Hant' || targetLang === 'yue') {
      return {
        systemPrompt: '你是一位中國詩詞專家。',
        systemRequires: [
          '請找出給到的文本的作者、朝代、標題、原文內容、原文翻譯、原文註釋和原文欣賞。',
          `按照下面格式中文阐述：
作者：<作者>
朝代：<朝代>
標題：<標題>

原文内容：
<原文内容>

原文翻譯：
<原文翻譯>

原文註釋：
<原文註釋>

原文欣賞：
<原文欣賞>`,
        ],
        userPrompt: '',
      }
    }
    return {
      systemPrompt: '你是一个中国诗词专家。',
      systemRequires: [
        '请找出给到的文本的作者、朝代、标题、原文内容、原文翻译、原文注释、原文赏析。',
        `按照下面格式中文阐述：
作者：<作者>
朝代：<朝代>
标题：<标题>

原文内容：
<原文内容>

原文翻译：
<原文翻译>

原文注释：
<原文注释>

原文赏析：
<原文赏析>`,
      ],
      userPrompt: '',
    }
  }

  if (fromChinese) {
    systemPrompt = '你是一个翻译引擎。'
    if (targetLang === 'zh-Hans') {
      return {
        systemPrompt,
        userPrompt: '将下面的内容翻译成简体白话文：',
      }
    }
    if (targetLang === 'zh-Hant') {
      return {
        systemPrompt,
        userPrompt: '將下面的內容翻譯成臺灣常用的繁體白話文：',
      }
    }
    if (targetLang === 'wyw') {
      return {
        systemPrompt,
        userPrompt: '将下面的内容翻译成中国的古文：',
      }
    }
    if (targetLang === 'yue') {
      return {
        systemPrompt,
        userPrompt: '將下面的內容翻譯成粵語：',
      }
    }
    return {
      systemPrompt,
      userPrompt,
    }
  }

  if (fromLang === 'en' && targetChinese && isEnglishWord(inputText)) {
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

  return {
    systemPrompt,
    userPrompt,
  }
}

function generatePromptsOfPolishing(
  os: GenerateSpecificPromptsOptions
): ChatCompletionsPrompts {
  const { targetLang, targetLangLabel, targetChinese } = os
  const systemPrompt =
    'Revise the following sentences to make them more clear, concise, and coherent.'
  const userPrompt = `Polish the text below in ${targetLangLabel} :`
  if (targetChinese) {
    if (targetLang === 'zh-Hant' || targetLang === 'yue') {
      return {
        systemPrompt,
        userPrompt: '用繁体中文來润色這段文字：',
      }
    }
    return {
      systemPrompt,
      userPrompt: '使用中文来润色此段文本：',
    }
  }
  return { systemPrompt, userPrompt }
}

function generatePromptsOfSummarize(
  os: GenerateSpecificPromptsOptions
): ChatCompletionsPrompts {
  const { targetLang, targetLangLabel, targetChinese } = os
  const systemPrompt =
    "You are a text summarizer, you can only summarize the text, don't interpret it."
  const userPrompt = `Summarize the text below in the most concise language and must use ${targetLangLabel} :`
  if (targetChinese) {
    if (targetLang === 'zh-Hant' || targetLang === 'yue') {
      return {
        systemPrompt,
        userPrompt: '請用最簡潔的中文總結這段文字：',
      }
    }
    return {
      systemPrompt,
      userPrompt: '用最简洁的中文语言总结此段文本：',
    }
  }
  return { systemPrompt, userPrompt }
}

function generatePromptsOfAnalyze(
  os: GenerateSpecificPromptsOptions
): ChatCompletionsPrompts {
  const { targetLang, targetLangLabel, targetChinese } = os
  const systemPrompt = 'You are a translation engine and grammar analyzer.'
  const userPrompt = `Translate the text below to ${targetLangLabel}  and explain the grammar in the original text using ${targetLangLabel} :`
  if (targetChinese) {
    if (targetLang === 'zh-Hant' || targetLang === 'yue') {
      return {
        systemPrompt,
        userPrompt: '請用中文翻譯下面的文本並解析原文中的語法：',
      }
    }
    return {
      systemPrompt,
      userPrompt: '请用中文翻译下面的文本并解析原文中的语法：',
    }
  }
  return { systemPrompt, userPrompt }
}

export function generateMessagesWithPrompts(
  options: ChatCompletionsPromptsOptions
): {
  messages: Message[]
  prompts: ChatCompletionsPrompts
  systemContent: string
  userContent: string
} {
  const prompts = generatePrompts(options)
  const { inputText } = options
  const { systemPrompt, systemRequires, userPrompt } = prompts

  const messages: Message[] = []
  const systemContents: string[] = []
  if (systemPrompt) {
    systemContents.push(systemPrompt)
    systemRequires?.forEach(req => systemContents.push(req))
  }
  const systemContent = systemContents.join('\n')
  if (systemContent) {
    messages.push({ role: 'system', content: systemContent })
  }

  const userContents: string[] = []
  if (userPrompt) {
    userContents.push(userPrompt)
  }
  userContents.push(inputText)
  const userContent = userContents.join('\n')
  messages.push({ role: 'user', content: userContent })

  return { messages, prompts, systemContent, userContent }
}

export function useMessagesWithPrompts(options: ChatCompletionsPromptsOptions) {
  const { fromLang, targetLang, translatorMode, inputText } = options
  return useMemo(() => {
    return generateMessagesWithPrompts({
      fromLang,
      targetLang,
      translatorMode,
      inputText,
    })
  }, [fromLang, targetLang, translatorMode, inputText])
}
