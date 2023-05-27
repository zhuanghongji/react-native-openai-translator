import { CellDivider } from '../../../components/CellDivider'
import { CellView } from '../../../components/CellView'
import { TitleBar } from '../../../components/TitleBar'
import { useThemeScheme } from '../../../themes/hooks'
import type { MainTabScreenProps } from '../../screens'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = MainTabScreenProps<'Discover'>

export function DiscoverScreen({ navigation }: Props): JSX.Element {
  const { t } = useTranslation()
  const { backgroundChat: backgroundColor } = useThemeScheme()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['bottom']}>
      <TitleBar backHidden title={t('Discover')} />
      <ScrollView style={{ flex: 1 }}>
        <CellView
          icon="awesome"
          iconColor="#8585D0"
          title={t('Awesome Prompts')}
          onPress={() => navigation.navigate('AwesomePrompts')}
        />
        <CellDivider />
        <CellView
          icon="book"
          iconColor="#B8834B"
          title={t('Prompt Engineering Guide')}
          onPress={() => {
            navigation.navigate('Web', {
              title: t('Prompt Engineering Guide'),
              url: 'https://www.promptingguide.ai',
            })
          }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
