import { TitleBar } from '../../../components/TitleBar'
import { dimensions } from '../../../res/dimensions'
import type { MainTabScreenProps } from '../../screens'
import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
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
