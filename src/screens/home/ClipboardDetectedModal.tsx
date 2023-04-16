import { ConfirmModal } from '../../components/ConfirmModal'
import { getMMKVString, setMMKVString } from '../../mmkv/func'
import { StorageKey } from '../../mmkv/keys'
import { useEnableClipboardDetectPref } from '../../preferences/storages'
import { trimContent } from '../../utils'
import Clipboard from '@react-native-clipboard/clipboard'
import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState, Keyboard, StyleProp, ViewStyle } from 'react-native'

export interface ClipboardDetectedModalProps {
  style?: StyleProp<ViewStyle>
  inputText: string
  outputText: string
  onConfirmPress: (text: string) => void
}

export const ClipboardDetectedModal = React.memo((props: ClipboardDetectedModalProps) => {
  const { style, inputText, outputText, onConfirmPress } = props

  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [textDetected, setTextDetected] = useState('')
  const isVisible = visible && textDetected ? true : false

  // Detect text in Clipboard when to be active
  const isFocused = useIsFocused()
  const [enableClipboardDetect] = useEnableClipboardDetectPref()
  useEffect(() => {
    if (!isFocused || !enableClipboardDetect) {
      return
    }
    const subscription = AppState.addEventListener('change', async state => {
      if (state !== 'active') {
        return
      }
      try {
        const _text = await Clipboard.getString()
        const text = trimContent(_text)
        const lastText = getMMKVString(StorageKey.lastDetectedText)
        if (!text || text === lastText || text === inputText || text === outputText) {
          return
        }
        Keyboard.dismiss()
        setMMKVString(StorageKey.lastDetectedText, text)
        setTextDetected(text)
        setVisible(true)
      } catch (e) {
        setVisible(false)
      }
    })
    return () => subscription.remove()
  }, [isFocused, enableClipboardDetect, inputText, outputText])

  return (
    <ConfirmModal
      style={style}
      visible={isVisible}
      title={t('Clipboard Detected')}
      message={textDetected}
      leftText={t('IGNORE')}
      rightText={t('AS INPUT')}
      onRightPress={() => {
        setTimeout(() => {
          setTextDetected('')
          onConfirmPress(textDetected)
        }, 520)
      }}
      onDismissRequest={setVisible}
    />
  )
})
