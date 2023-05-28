import { Divider } from '../../../components/Divider'
import { TitleBar } from '../../../components/TitleBar'
import { useQueryCustomChat } from '../../../db/table/t-custom-chat'
import { TCustomChat } from '../../../db/types'
import { useOnRefresh } from '../../../hooks'
import { dimensions } from '../../../res/dimensions'
import { useThemeScheme } from '../../../themes/hooks'
import { useCustomChatSettingsStore } from '../../../zustand/stores/custom-chat-settings'
import type { MainTabScreenProps } from '../../screens'
import { AddTip } from './AddTip'
import { CustomChatItemView } from './CustomChatItemView'
import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = MainTabScreenProps<'Chats'>

export function ChatsScreen({ navigation }: Props): JSX.Element {
  const { t } = useTranslation()
  const { background, backgroundChat } = useThemeScheme()

  const batchChat = useCustomChatSettingsStore(state => state.batchChat)

  const chatsResult = useQueryCustomChat({
    onSuccess: data => batchChat(data.rows._array),
  })
  const chats = chatsResult.data?.rows?._array ?? []
  const isEmpty = chats.length === 0

  const { refreshing, onRefresh } = useOnRefresh(chatsResult.refetch)

  const handleItemPress = (chat: TCustomChat) => {
    navigation.navigate('CustomChat', { chat })
  }

  const renderItemSeparator = () => <Divider />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundChat }} edges={['bottom']}>
      <TitleBar
        backHidden
        title={t('Chats')}
        action={{
          iconName: 'add-circle',
          onPress: () => navigation.push('CustomChatInit'),
        }}
      />
      {isEmpty ? (
        <AddTip />
      ) : (
        <FlashList
          contentContainerStyle={{ backgroundColor: background }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          data={chats}
          estimatedItemSize={dimensions.itemHeight}
          keyExtractor={(item, index) => `${index}_${item.id}`}
          renderItem={({ item }) => {
            return <CustomChatItemView item={item} onPress={handleItemPress} />
          }}
          ItemSeparatorComponent={renderItemSeparator}
        />
      )}
    </SafeAreaView>
  )
}
