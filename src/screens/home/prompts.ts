import { LanguageKey, TranslatorMode, languageLabelByKey } from '../../preferences/options'
import { Message } from '../../types'
import { isChineseLang, isEnglishWord } from '../../utils'
import { useMemo } from 'react'

export interface ChatCompletionsPrompts {
  systemPrompt: string
  userPromptPrefix?: string
  userPromptSuffix?: string
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

export function generatePrompts(options: ChatCompletionsPromptsOptions): ChatCompletionsPrompts {
  const { fromLang, targetLang, translatorMode, inputText } = options
  const fromLangLabel = languageLabelByKey(fromLang)
  const targetLangLabel = languageLabelByKey(targetLang)
  const os: GenerateSpecificPromptsOptions = {
    fromLang,
    targetLang,
    fromLangLabel,
    targetLangLabel,
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
      return { systemPrompt: '', userPromptPrefix: `Language of reply: ${targetLangLabel}\n` }
  }
}

function generatePromptsOfTranslate(os: GenerateSpecificPromptsOptions): ChatCompletionsPrompts {
  const { fromLang, targetLang, targetLangLabel, fromChinese, targetChinese, inputText } = os
  let systemPrompt = 'Act as a language translation engine'
  const userPromptPrefix = `Translate the following text into ${targetLangLabel} without explaining it:`

  if (fromLang === 'wyw' && targetChinese) {
    if (targetLang === 'wyw') {
      return {
        systemPrompt: '作为一个中国诗词专家',
        userPromptPrefix: '假设你是下面输入内容的原作者。\n输入内容："""',
        userPromptSuffix: '"""\n再写一句同样含义、同样字数的诗词：',
      }
    }
    if (targetLang === 'zh-Hant' || targetLang === 'yue') {
      return {
        systemPrompt: '作為一個中國詩詞專家',
        userPromptPrefix: `所需格式：
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
<原文欣賞>

輸入內容："""`,
        userPromptSuffix:
          '"""\n請找出上面輸入內容的作者、朝代、標題、原文內容、原文翻譯、原文註釋和原文欣賞：',
      }
    }
    return {
      systemPrompt: '作为一个中国诗词专家',
      userPromptPrefix: `所需格式：
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
<原文赏析>

输入内容："""`,
      userPromptSuffix:
        '"""\n请找出上面输入内容的作者、朝代、标题、原文内容、原文翻译、原文注释、原文赏析：',
    }
  }

  if (fromChinese) {
    systemPrompt = '作为一个语言翻译引擎'
    if (targetLang === 'zh-Hans') {
      return {
        systemPrompt,
        userPromptPrefix: '将下面的内容翻译成简体白话文：',
      }
    }
    if (targetLang === 'zh-Hant') {
      return {
        systemPrompt,
        userPromptPrefix: '將下面的內容翻譯成臺灣常用的繁體白話文：',
      }
    }
    if (targetLang === 'wyw') {
      return {
        systemPrompt,
        userPromptPrefix: '将下面的内容翻译成中国的古文：',
      }
    }
    if (targetLang === 'yue') {
      return {
        systemPrompt,
        userPromptPrefix: '將下面的內容翻譯成粵語：',
      }
    }
    return {
      systemPrompt,
      userPromptPrefix,
    }
  }

  if (fromLang === 'en' && targetChinese && isEnglishWord(inputText)) {
    return {
      systemPrompt: '作为一个英语翻译引擎',
      userPromptPrefix: `所需格式：：
<输入单词>
[<语种>] · / <单词音标>
[<词性缩写>] <中文含义>]

例句：
<序号><例句>\n(例句翻译)

输入单词："""`,
      userPromptSuffix:
        '"""请将翻译输入单词，不需要额外解释，同时给出单词原始形态、单词的语种、对应的音标、所词性的中文含义、三个双语示例句子：',
    }
  }

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
        userPromptPrefix: '用繁体中文來润色這段文本：',
      }
    }
    return {
      systemPrompt: '作为一个语句润色引擎',
      userPromptPrefix: '使用中文来润色这段文本：',
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
        userPromptPrefix: '請用最簡潔的繁体中文總結這段文本：',
      }
    }
    return {
      systemPrompt: '作为一个文本总结器',
      userPromptPrefix: '请用最简洁的中文语言总结这段文本：',
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
        userPromptPrefix: '請將下面的文本翻譯成繁體中文，並解析原文本的語法：',
      }
    }
    return {
      systemPrompt: '作为一个翻译引擎和语法分析器',
      userPromptPrefix: '请将下面的文本翻译成简体中文，并解析原文本的语法：',
    }
  }
  return { systemPrompt, userPromptPrefix }
}

export function generateMessagesWithPrompts(options: ChatCompletionsPromptsOptions): {
  messages: Message[]
  prompts: ChatCompletionsPrompts
  systemContent: string
  userContent: string
} {
  const prompts = generatePrompts(options)
  const { inputText } = options
  const { systemPrompt, userPromptPrefix, userPromptSuffix } = prompts

  const messages: Message[] = []
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }
  const userContent = [userPromptPrefix, inputText, userPromptSuffix]
    .filter(v => (v ? true : false))
    .join('\n')
  messages.push({ role: 'user', content: userContent })

  return { messages, prompts, systemContent: systemPrompt, userContent }
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
