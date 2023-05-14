import { CellGroup } from '../../../components/CellGroup'
import { CellView } from '../../../components/CellView'
import { TitleBar } from '../../../components/TitleBar'
import { dimensions } from '../../../res/dimensions'
import type { MainTabScreenProps } from '../../screens'
import React from 'react'
import { ScrollView, StyleSheet, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = MainTabScreenProps<'Me'>

export function MeScreen({ navigation }: Props): JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <TitleBar
        backDisabled
        title="Me"
        action={{ iconName: 'settings', onPress: () => navigation.push('Settings') }}
      />
      <ScrollView style={{ flex: 1 }}>
        <CellGroup>
          <CellView
            icon="heart-none"
            title="English Word Book"
            onPress={() => navigation.navigate('EnglishWordBook')}
          />
          <CellView
            icon="bookmarks"
            title="Mode Result Bookmarks"
            onPress={() => navigation.navigate('ModeResultBookmarks')}
          />
        </CellGroup>
      </ScrollView>
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
