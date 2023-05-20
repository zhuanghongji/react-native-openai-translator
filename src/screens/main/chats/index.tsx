import { Divider } from '../../../components/Divider'
import { TitleBar } from '../../../components/TitleBar'
import { dbSelectCustomChat } from '../../../db/table/t-custom-chat'
import { TCustomChat } from '../../../db/types'
import { print } from '../../../printer'
import { useThemeScheme } from '../../../themes/hooks'
import { useCustomChatSettingsStore } from '../../../zustand/stores/custom-chat-settings'
import type { MainTabScreenProps } from '../../screens'
import { AddTip } from './AddTip'
import { CustomChatItemView } from './CustomChatItemView'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = MainTabScreenProps<'Chats'>

export function ChatsScreen({ navigation }: Props): JSX.Element {
  const { t } = useTranslation()
  const { background, backgroundChat } = useThemeScheme()

  const [refreshing, setRefreshing] = useState(false)
  const [chats, setChats] = useState<TCustomChat[]>([])
  const isEmpty = chats.length === 0

  const batchChat = useCustomChatSettingsStore(state => state.batchChat)

  const onLoad = useCallback(() => {
    setRefreshing(true)
    dbSelectCustomChat()
      .then(result => {
        setChats(result.rows._array)
        batchChat(result.rows._array)
      })
      .catch(e => {
        print('dbSelectModeResult', e)
      })
      .finally(() => {
        setRefreshing(false)
      })
  }, [batchChat])

  useEffect(() => {
    onLoad()
  }, [])

  const handleItemPress = (chat: TCustomChat) => {
    navigation.navigate('CustomChat', { chat })
  }

  const renderItemSeparator = () => <Divider />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundChat }} edges={['bottom']}>
      <TitleBar
        backDisabled
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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onLoad} />}
          data={chats}
          estimatedItemSize={96}
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

// type Styles = {
//   modes: ViewStyle
// }

// const styles = StyleSheet.create<Styles>({
//   modes: {
//     flexDirection: 'row',
//     gap: dimensions.gap,
//     marginRight: dimensions.edge,
//   },
// })
