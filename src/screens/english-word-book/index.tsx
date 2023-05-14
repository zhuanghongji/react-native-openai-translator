import { Divider } from '../../components/Divider'
import { TitleBar } from '../../components/TitleBar'
import { TEnglishWord, dbSelectEnglishWord } from '../../db/table/t-english-word'
import { print } from '../../printer'
import { useThemeScheme } from '../../themes/hooks'
import type { RootStackParamList } from '../screens'
import { EnglishWrodItemView } from './EnglishWrodItemView'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'EnglishWordBook'>

export function EnglishWordBookScreen({ navigation: _ }: Props): JSX.Element {
  const { background, backgroundChat } = useThemeScheme()

  const [items, setItems] = useState<TEnglishWord[]>([])

  useEffect(() => {
    dbSelectEnglishWord()
      .then(result => {
        setItems(result.rows._array)
      })
      .catch(e => {
        print('dbSelectEnglishWord', e)
      })
  }, [])

  const renderItemSeparator = () => <Divider />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }} edges={['bottom']}>
      <TitleBar style={{ backgroundColor: backgroundChat }} title="English Word Book" />
      <FlashList
        data={items}
        estimatedItemSize={96}
        keyExtractor={(item, index) => `${index}_${item.id}`}
        renderItem={({ item }) => {
          return <EnglishWrodItemView item={item} />
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
