import { AWESOME_PROMPTS, AwesomePrompt } from '../../assets/awesome-chatgpt-prompts'
import { TitleBar } from '../../components/TitleBar'
import { TopButton } from '../../components/TopButton'
import { TextChunks, splitToTextChunks } from '../../components/chunks-text/utils'
import { DEFAULT_T_CUSTOM_CHAT_BASIC } from '../../db/helper'
import { dbFindCustomChatById, dbInsertCustomChat } from '../../db/table/t-custom-chat'
import { hapticSuccess, hapticWarning } from '../../haptic'
import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { toast } from '../../toast'
import { useCustomChatSettingsStore } from '../../zustand/stores/custom-chat-settings'
import type { RootStackParamList } from '../screens'
import { Header } from './Header'
import { ItemView } from './ItemView'
import { PromptDetailModal, PromptDetailModalHandle } from './PromptDetailModal'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'AwesomePrompts'>

type Item = {
  titleChunks: TextChunks
  contentChunks: TextChunks
}

const AnimatedFlashLish = Animated.createAnimatedComponent<FlashListProps<Item>>(FlashList)

export function AwesomePromptsScreen({ navigation }: Props): JSX.Element {
  const { backgroundChat: backgroundColor } = useThemeScheme()

  const { bottom } = useSafeAreaInsets()
  const { width: frameWidth, height: frameHeight } = useSafeAreaFrame()
  const promptDetailModalRef = useRef<PromptDetailModalHandle>(null)

  const flashListRef = useRef<FlashList<Item>>(null)
  const scrollY = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y
  })

  // just for better transition
  const [lazy, setLazy] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setLazy(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const [filterText, setFilterText] = useState('')

  const prompts = useMemo<AwesomePrompt[]>(() => {
    const items: AwesomePrompt[] = AWESOME_PROMPTS.filter((_, index) => {
      return lazy ? index < 20 : true
    }).map(v => ({
      // title: `Act as a ${v.title}`,
      title: v.title,
      content: v.content,
    }))
    if (!filterText) {
      return items
    }
    const lowerFilterText = filterText.toLocaleLowerCase()
    const result: AwesomePrompt[] = []
    for (const item of items) {
      const { title, content } = item
      if (
        title.toLocaleLowerCase().includes(lowerFilterText) ||
        content.toLocaleLowerCase().includes(lowerFilterText)
      ) {
        result.push(item)
      }
    }
    return result
  }, [AWESOME_PROMPTS, lazy, filterText])

  const data = useMemo<Item[]>(() => {
    return prompts.map(v => ({
      titleChunks: splitToTextChunks({ value: v.title, splitter: filterText }),
      contentChunks: splitToTextChunks({ value: v.content, splitter: filterText, maxLength: 45 }),
    }))
  }, [prompts, filterText])

  const handlePromptPress = (prompt: AwesomePrompt) => {
    promptDetailModalRef.current?.show(prompt)
  }

  const batchChat = useCustomChatSettingsStore(state => state.batchChat)
  const onCreateChatPress = async (prompt: AwesomePrompt) => {
    try {
      const { insertId } = await dbInsertCustomChat({
        ...DEFAULT_T_CUSTOM_CHAT_BASIC,
        chat_name: prompt.title,
        system_prompt: prompt.content,
      })
      if (insertId === undefined) {
        toast('danger', 'Error', 'Initialize Chat Error 1')
        return
      }
      const result = await dbFindCustomChatById(insertId)
      hapticSuccess()
      const [insertChat] = result.rows._array
      batchChat([insertChat])
      navigation.replace('CustomChat', { chat: insertChat })
    } catch (e) {
      hapticWarning()
      toast('danger', 'Error', 'Initialize Chat Error 2')
    }
  }

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['left', 'right']}>
        <TitleBar title="Awesome Prompts" />
        <AnimatedFlashLish
          ref={flashListRef}
          contentContainerStyle={{ paddingBottom: bottom }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          data={data}
          estimatedItemSize={dimensions.itemHeight}
          scrollEventThrottle={16}
          estimatedListSize={{ width: frameWidth, height: frameHeight }}
          keyExtractor={(item, index) => `${index}_${item.titleChunks.raw}`}
          renderItem={({ item }) => {
            const { titleChunks, contentChunks } = item
            return (
              <ItemView
                titleChunks={titleChunks}
                contentChunks={contentChunks}
                onPress={handlePromptPress}
              />
            )
          }}
          ListHeaderComponent={
            <Header filterText={filterText} onFilterTextChange={setFilterText} />
          }
          onScroll={scrollHandler}
        />
      </SafeAreaView>
      <TopButton
        scrollY={scrollY}
        onPress={() => {
          flashListRef.current?.scrollToOffset({ offset: 0, animated: true })
        }}
      />
      <PromptDetailModal ref={promptDetailModalRef} onCreateChatPress={onCreateChatPress} />
    </BottomSheetModalProvider>
  )
}
