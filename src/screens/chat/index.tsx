import { dimensions } from '../../res/dimensions'
import { ChatMessage } from '../../types'
import { RootStackParamList } from '../screens'
import { InputBar } from './InputBar'
import { TitleBar } from './TitleBar'
import { TEST_CHAT_MESSAGES } from './data'
import { AssistantMessageView } from './message-view/AssistantMessageView'
import { UserMessageView } from './message-view/UserMessageView'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, StyleSheet, View, ViewStyle } from 'react-native'
import {
  KeyboardEvents,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

// const AnimatedFlashList =
//   Animated.createAnimatedComponent<FlashList<ChatMessage>>(FlashList)

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>

export function ChatScreen({ navigation, route }: Props): JSX.Element {
  const [inputText, setInputText] = useState('')

  const flashListRef = useRef<FlashList<ChatMessage>>(null)
  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillShow', e => {
      flashListRef.current?.scrollToIndex({ index: 0 })
    })
    return () => {
      show.remove()
    }
  }, [])

  const { height } = useReanimatedKeyboardAnimation()
  const transformStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: height.value }],
    }),
    []
  )

  const renderItemSeparator = () => {
    return <View style={{ height: dimensions.edge * 2 }} />
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black' }}
      edges={['left', 'right']}>
      <TitleBar
        onBackPress={() => {
          navigation.goBack()
        }}
        onMorePress={() => {}}
      />
      <Animated.View style={[{ flex: 1, overflow: 'hidden' }]}>
        <Animated.View style={[{ flex: 1 }, transformStyle]}>
          <FlashList
            ref={flashListRef}
            contentContainerStyle={{ paddingVertical: dimensions.edge }}
            inverted={true}
            data={TEST_CHAT_MESSAGES}
            getItemType={item => item.role}
            keyExtractor={(item, index) =>
              `${index}_${item.role}_${item.content}`
            }
            renderItem={({ item }) => {
              if (item.role === 'user') {
                return <UserMessageView message={item} />
              }
              if (item.role === 'assistant') {
                return <AssistantMessageView message={item} />
              }
              return null
            }}
            ItemSeparatorComponent={renderItemSeparator}
            estimatedItemSize={200}
            onScrollBeginDrag={() => {
              Keyboard.dismiss()
            }}
          />
        </Animated.View>
      </Animated.View>
      <InputBar
        value={inputText}
        onChangeText={setInputText}
        onSendPress={() => {}}
      />
    </SafeAreaView>
  )
}

type Styles = {
  scanArea: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  scanArea: {},
})
