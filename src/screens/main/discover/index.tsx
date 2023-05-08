import { AWESOME_PROMPTS } from '../../../assets/awesome-chatgpt-prompts'
import { TitleBar } from '../../../components/TitleBar'
import { colors } from '../../../res/colors'
import { dimensions } from '../../../res/dimensions'
import { useThemeDark, useThemeScheme } from '../../../themes/hooks'
import type { MainTabScreenProps } from '../../screens'
import { EmptyView } from './EmptyView'
import { GroupDivider } from './GroupDivider'
import { GroupText } from './GroupText'
import { Header } from './Header'
import { ItemView } from './ItemView'
import { DiscoverChunk } from './types'
import { FlashList } from '@shopify/flash-list'
import React, { useMemo, useRef, useState } from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = MainTabScreenProps<'Discover'>

type Item = {
  title: string
  content: string
}

function addToResult(
  result: DiscoverChunk[],
  groupText: string,
  items: Item[],
  filterVisible: boolean,
  filterText: string
) {
  const _result: DiscoverChunk[] = []
  for (const { title, content } of items) {
    if (!filterVisible || !filterText) {
      _result.push({ type: 'item', title, content })
      continue
    }
    const lowerFilterText = filterText.toLocaleLowerCase()
    if (
      title.toLocaleLowerCase().includes(lowerFilterText) ||
      content.toLocaleLowerCase().includes(lowerFilterText)
    ) {
      _result.push({ type: 'item', title, content, filterText })
    }
  }

  if (_result.length === 0) {
    return
  }
  result.push({ type: 'group-divider' })
  result.push({ type: 'group-text', value: groupText })
  _result.forEach(item => result.push(item))
}

export function DiscoverScreen({ navigation }: Props): JSX.Element {
  const { backgroundChat: backgroundColor } = useThemeScheme()
  const dark = useThemeDark()
  const contentBackgroundColor = dark ? colors.black : colors.white

  const flashListRef = useRef<FlashList<DiscoverChunk>>(null)
  const [filterVisible, setFilterVisible] = useState(false)
  const [filterText, setFilterText] = useState('')

  const data = useMemo<DiscoverChunk[]>(() => {
    const result: DiscoverChunk[] = []
    addToResult(
      result,
      'Awesome Guides',
      [
        {
          title: 'Prompt Engineering Guide',
          content: 'Guides, papers, lecture, notebooks and resources for prompt engineering',
        },
      ],
      filterVisible,
      filterText
    )
    addToResult(result, 'Awesome Prompts', AWESOME_PROMPTS, filterVisible, filterText)
    if (result.length === 0) {
      result.push({ type: 'empty' })
    }
    return result
  }, [filterVisible, filterText])
  const stickyHeaderIndices = useMemo<number[]>(() => {
    const result: number[] = []
    data.forEach((chunk, index) => {
      if (chunk.type === 'group-text') {
        result.push(index)
      }
    })
    return result
  }, [data])

  const header = filterVisible ? (
    <Header filterText={filterText} onFilterTextChange={setFilterText} />
  ) : null
  // const renderSeperator = () => <Seperator />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['bottom']}>
      <TitleBar
        backDisabled
        style={{ backgroundColor: contentBackgroundColor }}
        title="Discover"
        action={{
          iconName: filterVisible ? 'filter-list-off' : 'filter-list',
          onPress: () => {
            setFilterVisible(!filterVisible)
            flashListRef.current?.scrollToOffset({ offset: 0, animated: true })
          },
        }}
      />
      <FlashList
        ref={flashListRef}
        contentContainerStyle={{ backgroundColor: contentBackgroundColor }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        data={data}
        stickyHeaderIndices={stickyHeaderIndices}
        estimatedItemSize={56}
        getItemType={item => item.type}
        keyExtractor={(item, index) => {
          if (item.type === 'group-divider') {
            return `${index}_group_divider`
          }
          if (item.type === 'group-text') {
            return `${index}_group_text_${item.value}`
          }
          if (item.type === 'item') {
            return `${index}_item_${item.title}`
          }
          if (item.type === 'empty') {
            return `${index}_empty`
          }
          return `${index}_unknown`
        }}
        renderItem={({ item }) => {
          if (item.type === 'group-divider') {
            return <GroupDivider />
          }
          if (item.type === 'group-text') {
            const { value } = item
            return <GroupText value={value} />
          }
          if (item.type === 'item') {
            const { title, content, filterText: _filterText } = item
            return (
              <ItemView title={`Act as a ${title}`} content={content} filterText={_filterText} />
            )
          }
          if (item.type === 'empty') {
            return <EmptyView />
          }
          return null
        }}
        ListHeaderComponent={header}
        // ItemSeparatorComponent={renderSeperator}
        // ListFooterComponent={<Footer />}
      />
    </SafeAreaView>
  )
}

type Styles = {
  modes: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  modes: {
    flexDirection: 'row',
    gap: dimensions.gap,
    marginRight: dimensions.edge,
  },
})
