import { CellDivider } from '../../../components/CellDivider'
import { CellView } from '../../../components/CellView'
import { TitleBar } from '../../../components/TitleBar'
import { useThemeScheme } from '../../../themes/hooks'
import type { MainTabScreenProps } from '../../screens'
import React from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = MainTabScreenProps<'Discover'>

export function DiscoverScreen({ navigation }: Props): JSX.Element {
  const { backgroundChat: backgroundColor } = useThemeScheme()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['bottom']}>
      <TitleBar backDisabled title="Discover" />
      <ScrollView style={{ flex: 1 }}>
        <CellView title="Awesome Prompts" onPress={() => navigation.navigate('AwesomePrompts')} />
        <CellDivider />
        <CellView title="Prompt Engineering Guide" onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
  )
}
