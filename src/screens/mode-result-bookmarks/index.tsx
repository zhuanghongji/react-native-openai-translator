import { Divider } from '../../components/Divider'
import { TitleBar } from '../../components/TitleBar'
import { TModeResult, dbSelectModeResult } from '../../db/table/t-mode-result'
import { print } from '../../printer'
import { useThemeScheme } from '../../themes/hooks'
import type { RootStackParamList } from '../screens'
import { ModeResultItemView } from './ModeResultItemView'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'ModeResultBookmarks'>

export function ModeResultBookmarksScreen({ navigation: _ }: Props): JSX.Element {
  const { background, backgroundChat } = useThemeScheme()

  const [items, setItems] = useState<TModeResult[]>([])

  useEffect(() => {
    dbSelectModeResult()
      .then(result => {
        setItems(result.rows._array)
      })
      .catch(e => {
        print('dbSelectModeResult', e)
      })
  }, [])

  const renderItemSeparator = () => <Divider />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundChat }} edges={['bottom']}>
      <TitleBar title="Mode Result Bookmarks" />
      <FlashList
        contentContainerStyle={{ backgroundColor: background }}
        data={items}
        estimatedItemSize={96}
        keyExtractor={(item, index) => `${index}_${item.id}`}
        renderItem={({ item }) => {
          return <ModeResultItemView item={item} />
        }}
        ItemSeparatorComponent={renderItemSeparator}
      />
    </SafeAreaView>
  )
}

// type Styles = {
//   container: ViewStyle
// }

// const styles = StyleSheet.create<Styles>({
//   container: {
//     flex: 1,
//   },
// })
