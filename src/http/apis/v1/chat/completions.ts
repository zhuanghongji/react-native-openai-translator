import {
  LanguageKey,
  TranslateMode,
  languageLabelByKey,
} from '../../../../preferences/options'
import { Message } from '../../../../types'
import { sseRequest } from '../../../sse-manager'

export interface ChatCompletion {
  id: string
  object: string
  created: number
  model: string
  choices: ChatCompletionChoice[]
}

export interface ChatCompletionChoice {
  delta: ChatCompletionChoiceDelta
  index: number
  finish_reason?: any
}

export interface ChatCompletionChoiceDelta {
  role?: string
  content?: string
}

export interface ChatCompletionsOptions {
  apiUrl: string
  apiUrlPath: string
  apiKey: string
  fromLang: LanguageKey | null
  targetLang: LanguageKey
  translateMode: TranslateMode
  userContent: string
}

export interface ChatCompletionsCallbacks {
  onSubscribe: () => void
  onNext: (content: string) => void
  onDone: (result: Message) => void
  onTimeout: () => void
  onError: (message: string) => void
  onComplete: () => void
}

interface ChatCompletionsPrompts {
  systemPrompt: string
  assistantPrompt: string
}

interface ChatCompletionsPromptsOptions {
  fromLang: LanguageKey | null
  targetLang: LanguageKey
  fromLangLabel: string
  targetLangLabel: string
  fromChinese: boolean
  targetChinese: boolean
  userContent: string
}

const LANGS_OF_CHINESE: LanguageKey[] = ['zh-Hans', 'zh-Hant', 'wyw', 'yue']

function isChinese(lang: LanguageKey | null) {
  if (lang === null) {
    return false
  }
  return LANGS_OF_CHINESE.includes(lang)
}

function isEnglishWord(str: string) {
  // Match words consisting of 2 or more letters, the first letter can be uppercase or lowercase.
  const pattern = /^[A-Za-z][a-z]+$/
  return pattern.test(str.trim())
}

function generatePrompts(
  options: Pick<
    ChatCompletionsOptions,
    'fromLang' | 'targetLang' | 'translateMode' | 'userContent'
  >
): Required<ChatCompletionsPrompts> {
  const { fromLang, targetLang, translateMode, userContent } = options
  const os: ChatCompletionsPromptsOptions = {
    fromLang,
    targetLang,
    fromLangLabel: languageLabelByKey(fromLang),
    targetLangLabel: languageLabelByKey(targetLang),
    fromChinese: isChinese(fromLang),
    targetChinese: isChinese(targetLang),
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
      return { systemPrompt: '', assistantPrompt: '' }
  }
}

function generatePromptsOfTranslate(
  os: ChatCompletionsPromptsOptions
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
    if (userContent.length < 5 && targetChinese) {
      return {
        systemPrompt: `你是一个翻译引擎，请将给到的文本翻译成${targetLangLabel}。请列出3种（如果有）最常用翻译结果：单词或短语，并列出对应的适用语境（用中文阐述）、音标、词性、双语示例。按照下面格式用中文阐述：
        <序号><单词或短语> · /<音标>
        [<词性缩写>] <适用语境（用中文阐述）>

        例句：
        <序号><例句>(例句翻译)`,
        assistantPrompt: '',
      }
    }
    if (targetLang === 'zh-Hans') {
      return { systemPrompt, assistantPrompt: '翻译成简体白话文' }
    }
    if (targetLang === 'zh-Hant') {
      return {
        systemPrompt,
        assistantPrompt: '翻譯成台灣常用用法之繁體中文白話文',
      }
    }
    if (targetLang === 'wyw' || targetLang === 'yue') {
      return {
        systemPrompt,
        assistantPrompt: `翻译成${targetLangLabel}`,
      }
    }
    return {
      systemPrompt,
      assistantPrompt: `translate from ${fromLangLabel} to ${targetLangLabel}`,
    }
  }
  if (isEnglishWord(userContent) && targetChinese) {
    return {
      systemPrompt: `你是一个翻译引擎，请将翻译给到的文本，只需要翻译不需要解释。当且仅当文本只有一个单词时，请给出单词原始形态（如果有）、单词的语种、对应的音标（如果有）、所有含义（含词性）、双语示例，至少三条例句，请严格按照下面格式给到翻译结果：
                <原始文本>
                [<语种>] · / <单词音标>
                [<词性缩写>] <中文含义>]

                例句：
                <序号><例句>(例句翻译)`,
      assistantPrompt: '',
    }
  }
  if (!fromLang) {
    return {
      systemPrompt,
      assistantPrompt: `translate to ${targetLangLabel}`,
    }
  }
  return {
    systemPrompt,
    assistantPrompt: `translate from ${fromLangLabel} to ${targetLangLabel}`,
  }
}

function generatePromptsOfPolishing(
  os: ChatCompletionsPromptsOptions
): ChatCompletionsPrompts {
  const { targetLangLabel, targetChinese } = os
  const systemPrompt =
    "You are a text summarizer, you can only summarize the text, don't interpret it."
  if (targetChinese) {
    return {
      systemPrompt,
      assistantPrompt: `使用 ${targetLangLabel} 语言润色此段文本`,
    }
  }
  return {
    systemPrompt,
    assistantPrompt: `Summarize this text in the most concise language and must use ${targetLangLabel}`,
  }
}

function generatePromptsOfSummarize(
  os: ChatCompletionsPromptsOptions
): ChatCompletionsPrompts {
  const { targetLangLabel, targetChinese } = os
  const systemPrompt =
    "You are a text summarizer, you can only summarize the text, don't interpret it."
  if (targetChinese) {
    return {
      systemPrompt,
      assistantPrompt: '用最简洁的语言使用中文总结此段文本',
    }
  }
  return {
    systemPrompt,
    assistantPrompt: `summarize this text in the most concise language and must use ${targetLangLabel} language!`,
  }
}

function generatePromptsOfAnalyze(
  os: ChatCompletionsPromptsOptions
): ChatCompletionsPrompts {
  const { targetLangLabel, targetChinese } = os
  const systemPrompt = 'You are a translation engine and grammar analyzer.'
  if (targetChinese) {
    return {
      systemPrompt,
      assistantPrompt: '请用中文翻译此段文本并解析原文中的语法',
    }
  }
  return {
    systemPrompt,
    assistantPrompt: `translate this text to ${targetLangLabel} and explain the grammar in the original text using ${targetLangLabel}`,
  }
}

function generatePromptsOfExplainCode(
  os: ChatCompletionsPromptsOptions
): ChatCompletionsPrompts {
  const { targetLangLabel, targetChinese } = os
  const systemPrompt =
    'You are a code explanation engine, you can only explain the code, do not interpret or translate it. Also, please report any bugs you find in the code to the author of the code.'
  if (targetChinese) {
    return {
      systemPrompt,
      assistantPrompt:
        '用最简洁的语言使用中文解释此段代码、正则表达式或脚本。如果内容不是代码，请返回错误提示。如果代码有明显的错误，请指出。',
    }
  }
  return {
    systemPrompt,
    assistantPrompt: `explain the provided code, regex or script in the most concise language and must use ${targetLangLabel} language! If the content is not code, return an error message. If the code has obvious errors, point them out.`,
  }
}

/**
 * Docs: https://platform.openai.com/docs/api-reference/completions
 */
export function sseRequestChatCompletions(
  options: ChatCompletionsOptions,
  callbacks: ChatCompletionsCallbacks
) {
  const {
    apiUrl,
    apiUrlPath,
    apiKey,
    fromLang,
    targetLang,
    translateMode,
    userContent,
  } = options
  const { onSubscribe, onNext, onDone, onTimeout, onError, onComplete } =
    callbacks

  // generate messages
  const { systemPrompt, assistantPrompt } = generatePrompts({
    fromLang,
    targetLang,
    translateMode,
    userContent,
  })
  const messages: Message[] = []
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }
  if (assistantPrompt) {
    messages.push({ role: 'user', content: assistantPrompt })
  }
  messages.push({ role: 'user', content: `"${userContent}"` })

  const result: Message<string> = { role: '', content: '' }
  const es = sseRequest(
    `${apiUrl}${apiUrlPath}`,
    {
      method: 'POST',
      apiKey,
      data: {
        model: 'gpt-3.5-turbo',
        temperature: 0,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1,
        stream: true,
        messages,
      },
    },
    {
      onOpen: onSubscribe,
      onMessage: data => {
        console.log('onMessage', data)
        if (!data) {
          return
        }
        if (data === '[DONE]') {
          es.close()
          onDone(result as Message)
          onComplete()
          return
        }
        const item = JSON.parse(data) as ChatCompletion
        for (const choice of item.choices) {
          const { role, content } = choice.delta
          if (role) {
            result.role += role
          }
          if (content) {
            result.content += content
            onNext(result.content)
          }
        }
      },
      onTimeout: () => {
        onTimeout()
        onComplete()
      },
      onError: message => {
        onError(message)
        onComplete()
      },
      onException: message => {
        onError(message)
        onComplete()
      },
    }
  )
}
