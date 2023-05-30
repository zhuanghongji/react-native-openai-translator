import { ALLOWED_COUNTRY_CODES, requestOpenAICDNCGITrace } from '../../../http/apis/cdn-cgi/trace'
import { print } from '../../../printer'
import { colors } from '../../../res/colors'
import { dimensions } from '../../../res/dimensions'
import { RootStackParamList } from '../../screens'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState, StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

type Status =
  | {
      supportive: true
    }
  | {
      supportive: false
      name: string
    }

export type UnsupportTipProps = {
  style?: StyleProp<TextStyle>
}

export function UnsupportTip(props: UnsupportTipProps) {
  const { style } = props

  const { t } = useTranslation()
  const [status, setStatus] = useState<Status>({ supportive: true })

  const navigation = useNavigation().getParent<NativeStackNavigationProp<RootStackParamList>>()

  const onLinkPress = () => {
    navigation.push('Web', {
      title: 'OpenAI',
      url: 'https://platform.openai.com/docs/supported-countries',
    })
  }

  const check = async () => {
    try {
      const data = await requestOpenAICDNCGITrace()
      const code = data.loc
      const supportive = ALLOWED_COUNTRY_CODES.has(code)
      if (!supportive) {
        setStatus({
          supportive: false,
          name: code,
        })
      } else {
        setStatus({ supportive: true })
      }
    } catch (e) {
      print('requestOpenAICDNCGITrace error')
    }
  }

  useEffect(() => {
    check()
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        check()
      }
    })
    return () => subscription.remove()
  }, [])

  if (status.supportive) {
    return null
  }
  if (status.name) {
    return (
      <Text style={[styles.text, style]} onPress={onLinkPress}>
        {t('Country Not Supported', { name: status.name })}
      </Text>
    )
  }
  return (
    <Text style={[styles.text, style]} onPress={onLinkPress}>
      {t('Country Not Detected')}
    </Text>
  )
}

type Styles = {
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.warning,
    textAlign: 'justify',
    marginTop: dimensions.edge,
    marginHorizontal: dimensions.edge,
    marginBottom: dimensions.edgeTwice,
  },
})
