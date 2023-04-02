import { TText } from '../../components/TText'
import { dimensions } from '../../res/dimensions'
import { useViewThemeColor } from '../../themes/hooks'
import React, { useImperativeHandle, useRef, useState } from 'react'
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import Modal from 'react-native-modal'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

export interface ClipboardTipModalProps {
  style?: StyleProp<ViewStyle>
}

export interface ClipboardTipModalHandle {
  show: (options: { text: string; onUseItPress: () => void }) => void
}

export const ClipboardTipModal = React.forwardRef<
  ClipboardTipModalHandle,
  ClipboardTipModalProps
>((props, ref) => {
  const { style } = props

  const borderSecondaryColor = useViewThemeColor('borderSecondary')
  const backdropColor = useViewThemeColor('backdrop')

  const { width: frameWidth } = useSafeAreaFrame()
  const [text, setText] = useState('')
  const isVisible = text ? true : false

  const onUseItPressRef = useRef<(() => void) | null>(null)
  useImperativeHandle(
    ref,
    () => ({
      show: options => {
        onUseItPressRef.current = options.onUseItPress
        setText(options.text)
      },
    }),
    []
  )

  const renderButton = (txt: string, onPress?: () => void) => {
    return (
      <Pressable style={styles.buttonContainer} onPress={onPress}>
        <TText style={styles.buttonText} type="text">
          {txt}
        </TText>
      </Pressable>
    )
  }

  return (
    <Modal
      style={[styles.container, style]}
      isVisible={isVisible}
      animationIn="fadeInUp"
      animationInTiming={500}
      animationOut="fadeOutUp"
      animationOutTiming={500}>
      <View
        style={[
          styles.content,
          {
            width: frameWidth * 0.8,
            backgroundColor: backdropColor,
          },
        ]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Clipboard</Text>
        </View>

        <TText style={styles.title} type="title">
          New Text Detected
        </TText>
        <TText style={styles.text} type="text" numberOfLines={7}>
          {text}
        </TText>
        <View
          style={[styles.buttonRow, { borderTopColor: borderSecondaryColor }]}>
          {renderButton('Ignore', () => {
            setText('')
          })}
          <View
            style={[
              styles.buttonDivider,
              { backgroundColor: borderSecondaryColor },
            ]}
          />
          {renderButton('Use It', () => {
            setText('')
            setTimeout(() => {
              onUseItPressRef.current?.()
            }, 600)
          })}
        </View>
      </View>
    </Modal>
  )
})

type Styles = {
  container: ViewStyle
  content: ViewStyle
  badge: ViewStyle
  badgeText: TextStyle
  title: TextStyle
  text: TextStyle
  buttonRow: ViewStyle
  buttonContainer: ViewStyle
  buttonDivider: ViewStyle
  buttonText: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  content: {
    borderRadius: dimensions.borderRadius,
    alignItems: 'center',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: -38,
    width: 120,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000033',
    transform: [
      {
        rotate: '45deg',
      },
    ],
  },
  badgeText: {
    color: '#FFFFFF33',
    fontSize: 11,
  },
  title: {
    marginTop: 18,
    fontSize: 22,
  },
  text: {
    width: '100%',
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 16,
    marginVertical: 36,
    textAlign: 'justify',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
  },
  buttonDivider: {
    width: 1,
    height: 48,
  },
  buttonContainer: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
  },
})
