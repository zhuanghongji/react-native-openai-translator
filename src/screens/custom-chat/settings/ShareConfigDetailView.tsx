import { TCustomChatDefault } from '../../../db/types'
import { hapticSoft } from '../../../haptic'
import { dimensions } from '../../../res/dimensions'
import { stylez } from '../../../res/stylez'
import { TText } from '../../../themes/TText'
import { toast } from '../../../toast'
import { SettingsTitleBar } from './SettingsTitleBar'
import Clipboard from '@react-native-clipboard/clipboard'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

type Item = [string, string | number | null]

export type ShareConfigDetailViewProps = {
  style?: StyleProp<ViewStyle>
  settings: TCustomChatDefault
  onBackNotify: () => void
}

export function ShareConfigDetailView(props: ShareConfigDetailViewProps) {
  const { style, settings, onBackNotify } = props

  const { t } = useTranslation()

  const text = useMemo<string>(() => {
    const {
      avatar,
      chat_name,
      system_prompt,
      font_size,
      model,
      temperature,
      context_messages_num,
    } = settings
    const items: Item[] = [
      [t('Avatar'), avatar],
      [t('Chat Name'), chat_name],
      [t('System Prompt'), system_prompt],
      [t('Font Size'), `${font_size} ${Platform.OS === 'ios' ? 'pt' : 'dp'}`],
      [t('Model'), model],
      [t('Temperature Value'), temperature],
      [t('Context Messages Number'), context_messages_num],
    ]
    const texts: string[] = []
    for (const [label, value] of items) {
      texts.push(`${label} : ${value ? value : '--'}`)
    }
    return texts.join('\n\n')
  }, [settings, t])

  return (
    <View style={[styles.container, style]}>
      <SettingsTitleBar
        actionText={t('COPY')}
        title={t('Share Config')}
        onBackNotify={onBackNotify}
        onActionPress={() => {
          hapticSoft()
          Clipboard.setString(text)
          toast('success', t('Copied to clipboard'), text)
        }}
      />
      <ScrollView style={stylez.f1} contentContainerStyle={{ paddingVertical: dimensions.edge }}>
        <TText style={[styles.text, { fontSize: settings.font_size }]} typo="text2">
          {text}
        </TText>
      </ScrollView>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'justify',
    marginHorizontal: dimensions.edge,
  },
})
