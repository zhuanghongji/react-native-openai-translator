import { TitleBar } from '../../components/TitleBar'
import type { RootStackParamList } from '../screens'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'Template'>

export function TemplateScreen({ navigation: _ }: Props): JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <TitleBar title="Template" />
    </SafeAreaView>
  )
}

// type Styles = {
//   container: ViewStyle
// }

// const styles = StyleSheet.create<Styles>({
//   container: {
//     flex: 1,
//   },
// })
