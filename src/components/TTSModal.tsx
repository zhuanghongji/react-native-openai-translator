import { LanguageKey } from '../preferences/options'
import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { texts } from '../res/texts'
import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react'
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import Modal from 'react-native-modal'
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
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

export const TTSModal = React.forwardRef<TTSModalHandle, TTSModalProps>(
  (props, ref) => {
    const { style } = props
    const { height: frameHeight } = useSafeAreaFrame()
    const { top, bottom } = useSafeAreaInsets()

    const [initError, setInitError] = useState(false)
    useEffect(() => {
      Tts.getInitStatus().catch(err => {
        if (err.code === 'no_engine') {
          Tts.requestInstallEngine()
        }
        setInitError(true)
      })
    }, [])

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

    useEffect(() => {
      if (!options) {
        return
      }
      Tts.addEventListener('tts-progress', event => {
        setProgress(event.location + event.length)
      })
      Tts.addEventListener('tts-finish', () => {
        setOptions(null)
      })
      return () => {
        Tts.removeAllListeners('tts-progress')
        Tts.removeAllListeners('tts-finish')
      }
    }, [options])

    useEffect(() => {
      if (!options) {
        Tts.stop()
        return
      }
      const { content, lang } = options
      speak(content, lang)
    }, [options])

    const speak = async (content: string, lang: string | null) => {
      if (lang === null) {
        Tts.stop()
        Tts.speak(content)
        return
      }
      try {
        const voices = await Tts.voices()
        // console.log('voices', { voices })
        const voice = voices.find(v => {
          if (lang === 'en') {
            return v.language === 'en' || v.language === 'en-US'
          }
          return v.language === lang
        })
        if (voice) {
          // console.log('voice', { voice })
          Tts.stop()
          if (Platform.OS === 'ios') {
            Tts.speak(content, {
              iosVoiceId: voice.id,
            } as any)
          } else {
            Tts.speak(content, {
              androidParams: {
                KEY_PARAM_PAN: -1,
                KEY_PARAM_VOLUME: 0.5,
                KEY_PARAM_STREAM: 'STREAM_MUSIC',
              },
            } as any)
          }
          return
        }
        Tts.stop()
        Tts.speak(content)
      } catch (e) {
        Tts.stop()
        Tts.speak(content)
      }
    }

    useImperativeHandle(ref, () => ({
      speak: (os: SpeakOptions) => {
        setProgress(0)
        setOptions(os)
      },
    }))

    return (
      <Modal
        style={[style, styles.container]}
        isVisible={isVisible}
        deviceHeight={frameHeight}
        animationIn="fadeInUp"
        animationOut="fadeOutDown">
        <Pressable
          style={[styles.content, { marginTop: top, marginBottom: bottom }]}
          onPress={() => setOptions(null)}>
          <View style={styles.textContainer}>
            {initError ? (
              <Text style={[styles.text, { color: colors.warning }]}>
                {texts.noEngine}
              </Text>
            ) : (
              <Text style={styles.text}>
                <Text style={{ color: colors.primary }}>
                  {highlightContent}
                </Text>
                <Text>{normalContent}</Text>
              </Text>
            )}
          </View>
        </Pressable>
      </Modal>
    )
  }
)

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
    backgroundColor: '#1D1D1D',
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
    color: 'white',
  },
})
