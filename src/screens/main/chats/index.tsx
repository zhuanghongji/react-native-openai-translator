import { Divider } from '../../../components/Divider'
import { TitleBar } from '../../../components/TitleBar'
import { TCustomChat, dbSelectCustomChat } from '../../../db/table/t-custom-chat'
import { print } from '../../../printer'
import { useThemeScheme } from '../../../themes/hooks'
import type { MainTabScreenProps } from '../../screens'
import { AddTip } from './AddTip'
import { CustomChatItemView } from './CustomChatItemView'
import { FlashList } from '@shopify/flash-list'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = MainTabScreenProps<'Chats'>

export function ChatsScreen({ navigation }: Props): JSX.Element {
  const { background, backgroundChat } = useThemeScheme()

  const [chats, setChats] = useState<TCustomChat[]>([])
  const isEmpty = chats.length === 0

  useEffect(() => {
    dbSelectCustomChat()
      .then(result => {
        setChats(result.rows._array)
      })
      .catch(e => {
        print('dbSelectModeResult', e)
      })
  }, [])

  const handleItemPress = (chat: TCustomChat) => {
    navigation.navigate('CustomChat', { chat })
  }

  const renderItemSeparator = () => <Divider />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundChat }} edges={['bottom']}>
      <TitleBar
        backDisabled
        title="Chats"
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
