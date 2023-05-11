import { AwesomePrompt } from '../../assets/awesome-chatgpt-prompts'
import { ToolButton } from '../../components/ToolButton'
import { hapticSoft } from '../../haptic'
import { print } from '../../printer'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { toast } from '../../toast'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import Clipboard from '@react-native-clipboard/clipboard'
import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

export type PromptDetailModalProps = {
  style?: StyleProp<ViewStyle>
  onCreateChatPress: (prompt: AwesomePrompt) => void
}

export type PromptDetailModalHandle = {
  show: (prompt: AwesomePrompt) => void
}

export const PromptDetailModal = React.forwardRef<PromptDetailModalHandle, PromptDetailModalProps>(
  (props, ref) => {
    const { style, onCreateChatPress } = props

    const { t } = useTranslation()
    const { text: textColor, text2: text2Color, backgroundChat: backgroundColor } = useThemeScheme()
    const { width: frameWidth } = useSafeAreaFrame()
    const contentWidth = frameWidth - dimensions.edgeTwice

    const [currentPrompt, setCurrentPrompt] = useState<AwesomePrompt | null>(null)

    const textStyle = [styles.text, { color: textColor, backgroundColor }]

    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ['60%'], [])
    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present()
    }, [])
    const handleSheetChanges = useCallback((index: number) => {
      print('handleSheetChanges', index)
      if (index < 0) {
        setCurrentPrompt(null)
      }
    }, [])

    useImperativeHandle(ref, () => ({
      show: (prompt: AwesomePrompt) => {
        setCurrentPrompt(prompt)
        handlePresentModalPress()
      },
    }))

    const renderBackdrop = useCallback(
      (_props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {..._props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      []
    )

    const renderHeader = (title: string, target: string) => {
      return (
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: text2Color }]}>{title}</Text>
          <ToolButton
            name="copy"
            onPress={() => {
              hapticSoft()
              Clipboard.setString(target)
              toast('success', t('Copied to clipboard'), target)
            }}
          />
        </View>
      )
    }

    const renderContent = () => {
      if (!currentPrompt) {
        return null
      }
      const { title, content } = currentPrompt
      return (
        <>
          <BottomSheetScrollView style={{ flex: 1 }}>
            <View style={{ width: contentWidth, marginLeft: dimensions.edge }}>
              {renderHeader('Chat Name', title)}
              <Text style={textStyle}>{title}</Text>
              {renderHeader('System Prompt', content)}
              <Text style={textStyle}>{content}</Text>
            </View>
          </BottomSheetScrollView>
          <View style={styles.createContainer}>
            <Pressable
              style={styles.createTouchable}
              onPress={() => {
                bottomSheetModalRef.current?.dismiss()
                onCreateChatPress(currentPrompt)
              }}>
              <Text style={styles.createText}>Create a new Chat with it</Text>
            </Pressable>
          </View>
        </>
      )
    }

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}>
        <View style={[styles.container, style]}>{renderContent()}</View>
      </BottomSheetModal>
    )
  }
)

type Styles = {
  container: ViewStyle
  headerRow: ViewStyle
  headerTitle: TextStyle
  text: TextStyle
  createContainer: ViewStyle
  createTouchable: ViewStyle
  createText: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dimensions.edge,
  },
  headerTitle: {
    flex: 1,
    fontSize: 13,
    marginLeft: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    padding: dimensions.edge,
    borderRadius: dimensions.borderRadius,
    marginBottom: dimensions.edge,
  },
  createContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: dimensions.edge,
    marginTop: dimensions.edge,
    marginBottom: 32,
  },
  createTouchable: {
    height: 48,
    paddingHorizontal: dimensions.edge,
    backgroundColor: colors.black,
    justifyContent: 'center',
    borderRadius: dimensions.borderRadius,
  },
  createText: {
    fontSize: 14,
    color: colors.white,
  },
})
