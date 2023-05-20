import { Divider } from '../../components/Divider'
import { dbSelectModeResultWhereMode } from '../../db/table/t-mode-result'
import { TModeResult } from '../../db/types'
import { TranslatorMode } from '../../preferences/options'
import { print } from '../../printer'
import { useThemeScheme } from '../../themes/hooks'
import { RootStackParamList } from '../screens'
import { ModeResultDetailModal, ModeResultDetailModalHandle } from './ModeResultDetailModal'
import { ModeResultItemView } from './ModeResultItemView'
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
    // navigation.push('ModeChat', {
    //   modeResult: TModeResult; systemPrompt: string; userContent: string; assistantContent: string; }
    // })
  }

  const [items, setItems] = useState<TModeResult[]>([])

  useEffect(() => {
    dbSelectModeResultWhereMode(mode)
      .then(result => {
        setItems(result.rows._array)
      })
      .catch(e => {
        print('dbSelectModeResult', e)
      })
  }, [mode])

  const renderItemSeparator = () => <Divider />

  return (
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
