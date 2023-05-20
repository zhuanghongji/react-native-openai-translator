import { AWESOME_PROMPTS, AwesomePrompt } from '../../assets/awesome-chatgpt-prompts'
import { TitleBar } from '../../components/TitleBar'
import { TextChunks, splitToTextChunks } from '../../components/chunks-text/utils'
import { DEFAULT_T_CUSTOM_CHAT_BASIC } from '../../db/helper'
import { dbFindCustomChatById, dbInsertCustomChat } from '../../db/table/t-custom-chat'
import { hapticSuccess, hapticWarning } from '../../haptic'
import { useThemeScheme } from '../../themes/hooks'
import { toast } from '../../toast'
import { useCustomChatSettingsStore } from '../../zustand/stores/custom-chat-settings'
import type { RootStackParamList } from '../screens'
import { Header } from './Header'
import { ItemView } from './ItemView'
import { PromptDetailModal, PromptDetailModalHandle } from './PromptDetailModal'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import React, { useMemo, useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'AwesomePrompts'>

type Item = {
  titleChunks: TextChunks
  contentChunks: TextChunks
}

export function AwesomePromptsScreen({ navigation }: Props): JSX.Element {
  const { backgroundChat: backgroundColor } = useThemeScheme()

  const { bottom } = useSafeAreaInsets()
  const promptDetailModalRef = useRef<PromptDetailModalHandle>(null)

  const flashListRef = useRef<FlashList<Item>>(null)
  const [filterText, setFilterText] = useState('')

  const prompts = useMemo<AwesomePrompt[]>(() => {
    const items: AwesomePrompt[] = AWESOME_PROMPTS.map(v => ({
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
  }, [AWESOME_PROMPTS, filterText])

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
        <FlashList
          ref={flashListRef}
          contentContainerStyle={{ paddingBottom: bottom }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          data={data}
          estimatedItemSize={56}
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
        />
      </SafeAreaView>
      <PromptDetailModal ref={promptDetailModalRef} onCreateChatPress={onCreateChatPress} />
    </BottomSheetModalProvider>
  )
}
