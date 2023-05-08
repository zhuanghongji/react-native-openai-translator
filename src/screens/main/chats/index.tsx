import { TitleBar } from '../../../components/TitleBar'
import { dimensions } from '../../../res/dimensions'
import type { MainTabScreenProps } from '../../screens'
import { AddTip } from './AddTip'
import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = MainTabScreenProps<'Chats'>

export function ChatsScreen({ navigation }: Props): JSX.Element {
  const isEmpty = true
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <TitleBar
        backDisabled
        title="Chats"
        action={{
          iconName: 'add-circle',
          onPress: () => navigation.push('CustomChatInit'),
        }}
      />
      {isEmpty ? <AddTip /> : null}
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
