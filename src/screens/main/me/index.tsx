import { CellDivider } from '../../../components/CellDivider'
import { CellGroup } from '../../../components/CellGroup'
import { CellView } from '../../../components/CellView'
import { TitleBar } from '../../../components/TitleBar'
import { useThemeScheme } from '../../../themes/hooks'
import type { MainTabScreenProps } from '../../screens'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = MainTabScreenProps<'Me'>

export function MeScreen({ navigation }: Props): JSX.Element {
  const { t } = useTranslation()

  const { backgroundChat: backgroundColor } = useThemeScheme()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['bottom']}>
      <TitleBar backHidden title={t('Me')} />
      <ScrollView style={{ flex: 1 }}>
        <CellGroup>
          <CellView
            icon="heart-checked"
            iconColor="#CA6D5C"
            title={t('English Word Book')}
            onPress={() => navigation.navigate('ModeWordCollected')}
          />
          <CellView
            icon="heart-none"
            iconColor="#CA6D5C"
            title={t('English Word Records')}
            onPress={() => navigation.navigate('ModeWordRecords')}
          />
        </CellGroup>
        <CellDivider />

        <CellGroup>
          <CellView
            icon="bookmark-checked"
            iconColor="#B8834B"
            title={t('Mode Result Collected')}
            onPress={() => navigation.navigate('ModeResultCollected')}
          />
          <CellView
            icon="bookmark-none"
            iconColor="#B8834B"
            title={t('Mode Result Records')}
            onPress={() => navigation.navigate('ModeResultRecords')}
          />
        </CellGroup>
        <CellDivider />

        <CellView
          icon="settings"
          iconColor="#5D8DE7"
          title={t('Settings')}
          onPress={() => navigation.push('Settings')}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
