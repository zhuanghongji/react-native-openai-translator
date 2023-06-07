interface OpenAIModels {
  object: string
  data: OpenAIModel[]
}

interface OpenAIModel {
  id: string
  object: string
  created: number
  owned_by: string
  permission: OpenAIModelPermission[]
  root: string
  parent?: any
}

interface OpenAIModelPermission {
  id: string
  object: string
  created: number
  allow_create_engine: boolean
  allow_sampling: boolean
  allow_logprobs: boolean
  allow_search_indices: boolean
  allow_view: boolean
  allow_fine_tuning: boolean
  organization: string
  group?: any
  is_blocking: boolean
}

interface OpenAIModelsError {
  message: string
  type: string
  param?: any
  code: string
}

export async function requestOpenAIModels(apiKey: string): Promise<OpenAIModels> {
  try {
    const resp = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    const result = await resp.json()
    if (result.error) {
      return Promise.reject(result.error as OpenAIModelsError)
    }
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}
