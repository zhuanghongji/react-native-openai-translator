import { hapticError } from '../../haptic'
import {
  useApiKeyPref,
  useApiModelPref,
  useApiUrlPathPref,
  useApiUrlPref,
} from '../../preferences/storages'
import { RootStackParamList } from '../../screens/screens'
import { toast } from '../../toast'
import type { OpenAIApiUrlOptions } from './type'
import { ChatCompletionsCustomizedOptions } from './v1/chat/completions'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'

export function useOpenAIApiUrlOptions() {
  const { t } = useTranslation()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const [apiUrl] = useApiUrlPref()
  const [apiUrlPath] = useApiUrlPathPref()
  const [apiKey] = useApiKeyPref()
  const checkIsOptionsValid = (): boolean => {
    if (!apiUrl) {
      hapticError()
      toast('warning', t('Warning'), t('Please enter the API URL first'), () =>
        navigation.push('Settings')
      )
      return false
    }
    if (!apiUrlPath) {
      hapticError()
      toast('warning', t('Warning'), t('Please enter the API URL Path first'), () =>
        navigation.push('Settings')
      )
      return false
    }
    if (!apiKey) {
      hapticError()
      toast('warning', t('Warning'), t('Please enter the API Key first'), () => {
        navigation.push('ApiKeys')
      })
      return false
    }
    return true
  }
  return {
    urlOptions: { apiUrl, apiUrlPath, apiKey } satisfies OpenAIApiUrlOptions,
    checkIsOptionsValid,
  }
}

export function useOpenAIApiCustomizedOptions(): ChatCompletionsCustomizedOptions {
  const [model] = useApiModelPref()
  return { model }
}
