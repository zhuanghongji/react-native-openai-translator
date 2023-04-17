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
    let enterTip = ''
    if (!apiUrl) {
      enterTip = t('Enter API URL first')
    } else if (!apiUrlPath) {
      enterTip = t('Enter API URL Path first')
    } else if (!apiKey) {
      enterTip = t('Enter API Key first')
    }
    if (enterTip) {
      hapticError()
      toast('warning', t('Warning'), enterTip, () => navigation.push('Settings'))
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
