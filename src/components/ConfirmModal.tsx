import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeColor } from '../themes/hooks'
import { TText } from './TText'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import Modal from 'react-native-modal'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

export interface ConfirmModalProps {
  style?: StyleProp<ViewStyle>
  visible: boolean
  title?: string
  message: string
  leftText: string
  rightText: string
  onLeftPress?: () => void
  onRightPress: () => void
  onDismissRequest: (visible: false) => void
}

export const ConfirmModal = React.memo((props: ConfirmModalProps) => {
  const {
    style,
    visible,
    title,
    message,
    leftText,
    rightText,
    onLeftPress,
    onRightPress,
    onDismissRequest,
  } = props

  const borderColor = useThemeColor('border2')
  const backdropColor = useThemeColor('backdrop')

  const { width: frameWidth, height: frameHeight } = useSafeAreaFrame()

  const dissmiss = () => onDismissRequest(false)

  const renderButton = (txtStyle: TextStyle | undefined, txt: string, onPress?: () => void) => {
    return (
      <Pressable
        style={styles.buttonContainer}
        onPress={() => {
          dissmiss()
          onPress?.()
        }}>
        <TText style={[styles.buttonText, txtStyle]} typo="text">
          {txt}
        </TText>
      </Pressable>
    )
  }

  return (
    <Modal
      style={[styles.container, style]}
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationOutTiming={1}
      deviceHeight={frameHeight}
      statusBarTranslucent={true}
      onBackdropPress={dissmiss}>
      <View
        style={[
          styles.content,
          {
            width: frameWidth * 0.8,
            backgroundColor: backdropColor,
          },
        ]}>
        {title ? (
          <TText style={styles.title} typo="text">
            {title}
          </TText>
        ) : null}
        <TText style={styles.message} typo="text">
          {message}
        </TText>
        <View style={[styles.buttonRow, { borderTopColor: borderColor }]}>
          {renderButton(undefined, leftText, onLeftPress)}
          <View style={[styles.buttonDivider, { backgroundColor: borderColor }]} />
          {renderButton({ color: colors.accent }, rightText, onRightPress)}
        </View>
      </View>
    </Modal>
  )
})

type Styles = {
  container: ViewStyle
  content: ViewStyle
  title: TextStyle
  message: TextStyle
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
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    marginTop: 24,
  },
  message: {
    width: '100%',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
    marginVertical: 32,
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
    fontWeight: 'bold',
  },
})
