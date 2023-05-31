import { Divider } from '../../components/Divider'
import {
  ModeResultDetailModal,
  ModeResultDetailModalHandle,
} from '../../components/ModeResultDetailModal'
import { ModeResultItemView } from '../../components/ModeResultItemView'
import { InfiniteQueryListContainer } from '../../components/query/InfiniteQueryListContainer'
import { useInfiniteQueryModeResultPageableWhere } from '../../db/table/t-mode-result'
import { TModeResult } from '../../db/types'
import { TranslatorMode } from '../../preferences/options'
import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { RootStackParamList } from '../screens'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types'
import { FlashList } from '@shopify/flash-list'
import React, { useRef } from 'react'

export type ModeResultSceneProps = {
  mode: TranslatorMode
}

export function ModeResultScene(props: ModeResultSceneProps): JSX.Element {
  const { mode } = props

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const { backgroundItem: backgroundColor } = useThemeScheme()

  const detailModalRef = useRef<ModeResultDetailModalHandle>(null)
  const onItemPress = (item: TModeResult) => {
    detailModalRef.current?.show(item)
  }
  const onToChatPress = (item: TModeResult) => {
    navigation.push('ModeChat', { modeResult: item })
  }

  const result = useInfiniteQueryModeResultPageableWhere({
    mode,
    type: '0',
    collected: '1',
  })

  const renderItemSeparator = () => <Divider wing={dimensions.edge} />

  return (
    <>
      <InfiniteQueryListContainer
        style={{ flex: 1 }}
        result={result}
        renderContent={({ items, refreshControl, onEndReached }) => {
          return (
            <FlashList
              contentContainerStyle={{ backgroundColor }}
              refreshControl={refreshControl}
              data={items}
              estimatedItemSize={dimensions.itemHeight}
              keyExtractor={(item, index) => `${index}_${item.id}`}
              renderItem={({ item }) => {
                return <ModeResultItemView item={item} onPress={onItemPress} />
              }}
              ItemSeparatorComponent={renderItemSeparator}
              onEndReached={onEndReached}
            />
          )
        }}
      />
      <ModeResultDetailModal ref={detailModalRef} onToChatPress={onToChatPress} />
    </>
  )
}
