import { LanguageKey } from '../preferences/options'
import { print } from '../printer'
import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeColor } from '../themes/hooks'
import { isChineseLang } from '../utils'
import { TText } from './TText'
import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import Modal from 'react-native-modal'
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context'
import Tts from 'react-native-tts'

type SpeakOptions = {
  content: string
  lang: LanguageKey | null
}

export type TTSModalProps = {
  style?: StyleProp<ViewStyle>
}

export type TTSModalHandle = {
  speak: (options: SpeakOptions) => void
}

export const TTSModal = React.forwardRef<TTSModalHandle, TTSModalProps>((props, ref) => {
  const { style } = props
  const { height: frameHeight } = useSafeAreaFrame()
  const { top, bottom } = useSafeAreaInsets()

  const { t } = useTranslation()
  const backgroundColor = useThemeColor('background2')

  const [options, setOptions] = useState<SpeakOptions | null>(null)
  const isVisible = options !== null

  const [progress, setProgress] = useState(0)
  const { highlightContent, normalContent } = useMemo<{
    highlightContent: string
    normalContent: string
  }>(() => {
    const content = options?.content ?? ''
    if (!content) {
      return {
        highlightContent: '',
        normalContent: '',
      }
    }
    if (progress >= content.length - 1) {
      return {
        highlightContent: content,
        normalContent: '',
      }
    }
    return {
      highlightContent: content.slice(0, progress),
      normalContent: content.slice(progress),
    }
  }, [progress, options])

  const [errorMessage, setErrorMessage] = useState('')
  const [ttsStatus, setTTSStatus] = useState<'unknown' | 'success' | 'error'>('unknown')
  const [currentLang, setCurrentLang] = useState<LanguageKey | null | undefined>(undefined)
  if (options?.lang !== undefined && options.lang !== currentLang) {
    setTTSStatus('unknown')
    setCurrentLang(options.lang)
  }

  useEffect(() => {
    if (currentLang === undefined) {
      return
    }
    const init = async () => {
      try {
        const voices = await Tts.voices()
        const targetVoice = voices.find(v => {
          if (v.networkConnectionRequired || v.notInstalled) {
            return false
          }
          if (currentLang === null) {
            return true
          }
          if (v.language === currentLang) {
            return true
          }
          if (v.language === 'zh' && isChineseLang(currentLang)) {
            return true
          }
          if (v.language.startsWith('en-') && currentLang === 'en') {
            return true
          }
          return false
        })
        if (!targetVoice) {
          setErrorMessage(t('Unable to find a matching speech engine'))
          setTTSStatus('error')
          return
        }
        try {
          await Tts.setDefaultLanguage(targetVoice.language)
        } catch (err) {
          // My Samsung S9 has always this error: "Language is not supported"
        }
        await Tts.setDefaultVoice(targetVoice.id)
        print('init success', { targetVoice })
        setTTSStatus('success')
      } catch (e: any) {
        if (e.code === 'no_engine') {
          setErrorMessage(
            t(
              'Maybe the Text-to-Speech engine is not (yet) installed on the phone, please install and restart the app'
            )
          )
        } else {
          setErrorMessage(t('Init Text-to-Speech failed'))
        }
        setTTSStatus('error')
      }
    }
    init()
  }, [currentLang, t])

  useEffect(() => {
    if (!options) {
      return
    }
    Tts.addEventListener('tts-start', () => {
      print('tts-start')
    })
    Tts.addEventListener('tts-progress', event => {
      // print('tts-progress', event)
      // Whether to invoke this method depends on the speech engine.
      setProgress(event.location + event.length)
    })
    Tts.addEventListener('tts-finish', () => {
      setOptions(null)
    })
    Tts.addEventListener('tts-cancel', () => {
      setOptions(null)
    })
    Tts.addEventListener('tts-error', () => {
      setErrorMessage('Speak failed')
      setTTSStatus('error')
    })
    return () => {
      Tts.removeAllListeners('tts-start')
      Tts.removeAllListeners('tts-progress')
      Tts.removeAllListeners('tts-finish')
      Tts.removeAllListeners('tts-cancel')
      Tts.removeAllListeners('tts-error')
    }
  }, [options])

  useEffect(() => {
    if (!options) {
      return
    }
    if (ttsStatus !== 'success') {
      return
    }
    const { content } = options
    Tts.stop()
    Tts.speak(content)
  }, [options, ttsStatus])

  useImperativeHandle(ref, () => ({
    speak: (os: SpeakOptions) => {
      setProgress(0)
      setOptions(os)
    },
  }))

  return (
    <Modal
      style={[styles.container, style, { backgroundColor }]}
      isVisible={isVisible}
      deviceHeight={frameHeight}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      hasBackdrop={false}
      statusBarTranslucent={true}>
      <Pressable
        style={[styles.content, { marginTop: top, marginBottom: bottom }]}
        onPress={() => setOptions(null)}>
        <View style={styles.textContainer}>
          {ttsStatus === 'error' ? (
            <Text style={[styles.text, { color: colors.warning, fontStyle: 'italic' }]}>
              {errorMessage + ' 😲'}
            </Text>
          ) : (
            <TText style={styles.text} typo="text">
              <Text style={{ color: colors.primary }}>{highlightContent}</Text>
              <Text>{normalContent}</Text>
            </TText>
          )}
        </View>
      </Pressable>
    </Modal>
  )
})

type Styles = {
  container: ViewStyle
  content: ViewStyle
  textContainer: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  textContainer: {
    flex: 1,
    padding: dimensions.edge,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    lineHeight: 37,
  },
})
