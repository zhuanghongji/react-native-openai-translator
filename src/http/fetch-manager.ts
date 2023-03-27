export async function requestGetBySteam(content: string) {
  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer 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',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1,
        stream: true,
        messages: [
          {
            role: 'system',
            content: `你是一个翻译引擎，请将给到的文本翻译成中文。请列出3种（如果有）最常用翻译结果：单词或短语，并列出对应的适用语境（用中文阐述）、音标、词性、双语示例。按照下面格式用中文阐述：
              <序号><单词或短语> · /<音标>
              [<词性缩写>] <适用语境（用中文阐述）>
              例句：<例句>(例句翻译)`,
          },
          {
            role: 'user',
            content: `${content}`,
          },
        ],
      }),
    })
    const a = await resp.blob()
  } catch (e) {
    return Promise.reject(e)
  }
}
