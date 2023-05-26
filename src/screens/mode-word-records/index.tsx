import { Divider } from '../../components/Divider'
import {
  ModeResultDetailModal,
  ModeResultDetailModalHandle,
} from '../../components/ModeResultDetailModal'
import { ModeResultItemView } from '../../components/ModeResultItemView'
import { TitleBar } from '../../components/TitleBar'
import { InfiniteQueryListContainer } from '../../components/query/InfiniteQueryListContainer'
import { useInfiniteQueryModeResultPageableWhere } from '../../db/table/t-mode-result'
import { TModeResult } from '../../db/types'
import { TranslatorMode } from '../../preferences/options'
import { useThemeScheme } from '../../themes/hooks'
import type { RootStackParamList } from '../screens'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'ModeWordRecords'>

export function ModeWordRecordsScreen({ navigation }: Props): JSX.Element {
  const { t } = useTranslation()
  const { backgroundChat } = useThemeScheme()

  const detailModalRef = useRef<ModeResultDetailModalHandle>(null)
  const onItemPress = (item: TModeResult) => {
    detailModalRef.current?.show(item)
  }
  const onToChatPress = (item: TModeResult) => {
    navigation.push('ModeChat', { modeResult: item })
  }

  const mode: TranslatorMode = 'translate'
  const result = useInfiniteQueryModeResultPageableWhere({
    mode,
    type: '1',
  })

  const renderItemSeparator = () => <Divider />

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: backgroundChat }} edges={['bottom']}>
        <TitleBar title={t('English Word Records')} />
        <InfiniteQueryListContainer
          style={{ flex: 1 }}
          result={result}
          renderContent={({ items, refreshControl, onEndReached }) => {
            return (
              <FlashList
                refreshControl={refreshControl}
                data={items}
                estimatedItemSize={96}
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
      </SafeAreaView>
    </BottomSheetModalProvider>
  )
}
