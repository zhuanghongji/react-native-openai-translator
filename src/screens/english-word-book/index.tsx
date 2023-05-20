import { Divider } from '../../components/Divider'
import { EmptyView } from '../../components/EmptyView'
import { TitleBar } from '../../components/TitleBar'
import { dbSelectModeWord } from '../../db/table/t-mode-word'
import { TModeWord } from '../../db/types'
import { print } from '../../printer'
import { useThemeScheme } from '../../themes/hooks'
import type { RootStackParamList } from '../screens'
import { EnglishWrodItemView } from './EnglishWrodItemView'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'EnglishWordBook'>

export function EnglishWordBookScreen({ navigation: _ }: Props): JSX.Element {
  const { t } = useTranslation()
  const { background, backgroundChat } = useThemeScheme()

  const [items, setItems] = useState<TModeWord[]>([])

  useEffect(() => {
    dbSelectModeWord()
      .then(result => {
        setItems(result.rows._array)
      })
      .catch(e => {
        print('dbSelectModeWord', e)
      })
  }, [])

  const renderItemSeparator = () => <Divider />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundChat }} edges={['bottom']}>
      <TitleBar title={t('English Word Book')} />
      {items.length === 0 ? (
        <EmptyView />
      ) : (
        <FlashList
          contentContainerStyle={{ backgroundColor: background }}
          data={items}
          estimatedItemSize={96}
          keyExtractor={(item, index) => `${index}_${item.id}`}
          renderItem={({ item }) => {
            return <EnglishWrodItemView item={item} />
          }}
          ItemSeparatorComponent={renderItemSeparator}
        />
      )}
    </SafeAreaView>
  )
}
