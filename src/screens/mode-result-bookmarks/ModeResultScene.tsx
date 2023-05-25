import { Divider } from '../../components/Divider'
import { EmptyView } from '../../components/EmptyView'
import {
  ModeResultDetailModal,
  ModeResultDetailModalHandle,
} from '../../components/ModeResultDetailModal'
import { ModeResultItemView } from '../../components/ModeResultItemView'
import { dbSelectModeResultWhereModeAndType } from '../../db/table/t-mode-result'
import { TModeResult } from '../../db/types'
import { TranslatorMode } from '../../preferences/options'
import { print } from '../../printer'
import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { RootStackParamList } from '../screens'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types'
import { FlashList } from '@shopify/flash-list'
import React, { useEffect, useRef, useState } from 'react'

export type ModeResultSceneProps = {
  mode: TranslatorMode
}

export function ModeResultScene(props: ModeResultSceneProps): JSX.Element {
  const { mode } = props
  const { background } = useThemeScheme()

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const detailModalRef = useRef<ModeResultDetailModalHandle>(null)
  const onItemPress = (item: TModeResult) => {
    detailModalRef.current?.show(item)
  }
  const onToChatPress = (item: TModeResult) => {
    navigation.push('ModeChat', { modeResult: item })
  }

  const [items, setItems] = useState<TModeResult[]>([])

  useEffect(() => {
    dbSelectModeResultWhereModeAndType(mode, '0')
      .then(result => {
        setItems(result.rows._array)
      })
      .catch(e => {
        print('dbSelectModeResult', e)
      })
  }, [mode])

  const renderItemSeparator = () => <Divider />

  return items.length === 0 ? (
    <EmptyView style={{ justifyContent: 'flex-start', paddingTop: dimensions.edgeTwice }} />
  ) : (
    <>
      <FlashList
        contentContainerStyle={{ backgroundColor: background }}
        data={items}
        estimatedItemSize={96}
        keyExtractor={(item, index) => `${index}_${item.id}`}
        renderItem={({ item }) => {
          return <ModeResultItemView item={item} onPress={onItemPress} />
        }}
        ItemSeparatorComponent={renderItemSeparator}
      />
      <ModeResultDetailModal ref={detailModalRef} onToChatPress={onToChatPress} />
    </>
  )
}
