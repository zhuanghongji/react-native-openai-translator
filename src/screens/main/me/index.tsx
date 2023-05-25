import { CellDivider } from '../../../components/CellDivider'
import { CellGroup } from '../../../components/CellGroup'
import { CellView } from '../../../components/CellView'
import { TitleBar } from '../../../components/TitleBar'
import type { MainTabScreenProps } from '../../screens'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = MainTabScreenProps<'Me'>

export function MeScreen({ navigation }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <TitleBar backDisabled title={t('Me')} />
      <ScrollView style={{ flex: 1 }}>
        <CellGroup>
          <CellView
            icon="heart-none"
            iconColor="#CA6D5C"
            title={t('English Word Book')}
            onPress={() => navigation.navigate('ModeWordBook')}
          />
          <CellView
            icon="bookmarks"
            iconColor="#A97D5D"
            title={t('Mode Result Bookmarks')}
            onPress={() => navigation.navigate('ModeResultBookmarks')}
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
