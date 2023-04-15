import { LanguageKey } from '../preferences/options'
import { print } from '../printer'
import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { lotties } from '../res/lotties'
import { useThemeColor } from '../themes/hooks'
import { isChineseLang } from '../utils'
import { TText } from './TText'
import LottieView from 'lottie-react-native'
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
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

  const speakingRef = useRef(false)
  const lottieViewRef = useRef<LottieView>(null)

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
      if (speakingRef.current) {
        speakingRef.current = false
        Tts.stop()
        lottieViewRef.current?.reset()
      }
      return
    }
    if (ttsStatus !== 'success') {
      return
    }
    speakingRef.current = true
    const { content } = options
    Tts.stop()
    Tts.speak(content)
    lottieViewRef.current?.play()
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
      <View style={[styles.container, { marginTop: top, marginBottom: bottom }]}>
        <ScrollView style={[styles.scrollView]} contentContainerStyle={styles.scrollContent}>
          <Pressable onPress={() => setOptions(null)}>
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
          </Pressable>
        </ScrollView>
        <View style={styles.animContainer}>
          <LottieView
            ref={lottieViewRef}
            style={styles.anim}
            source={lotties.speaking}
            loop={true}
          />
        </View>
      </View>
    </Modal>
  )
})

type Styles = {
  container: ViewStyle
  content: ViewStyle
  scrollView: ViewStyle
  scrollContent: ViewStyle
  text: TextStyle
  animContainer: ViewStyle
  anim: ViewStyle
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
  scrollView: {
    flex: 1,
    width: '100%',
    padding: dimensions.edge,
  },
  scrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: dimensions.spaceBottom,
  },
  text: {
    fontSize: 28,
    lineHeight: 37,
  },
  animContainer: {
    width: '100%',
    alignItems: 'flex-end',
    padding: dimensions.spaceBottom,
  },
  anim: { width: 24, height: 24 },
})
