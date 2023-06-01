import { SvgIcon, SvgIconName } from '../../components/SvgIcon'
import { TitleBar } from '../../components/TitleBar'
import { TranslatorMode } from '../../preferences/options'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { stylez } from '../../res/stylez'
import { useThemeScheme } from '../../themes/hooks'
import type { RootStackParamList } from '../screens'
import { ModeResultScene } from './ModeResultScene'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Route, TabBar, TabView } from 'react-native-tab-view'

type Props = NativeStackScreenProps<RootStackParamList, 'ModeResultRecords'>

type ResultRoute = Route & {
  key: string
  mode: TranslatorMode
  iconName: SvgIconName
}

export function ModeResultRecordsScreen({ navigation: _ }: Props): JSX.Element {
  const { t } = useTranslation()
  const {
    backgroundChat: backgroundColor,
    backgroundIndicator,
    textActive,
    textInactive,
  } = useThemeScheme()

  const [tabIndex, setTabIndex] = useState(0)
  const [routes] = useState<ResultRoute[]>([
    { key: 'translate', mode: 'translate', iconName: 'language' },
    { key: 'polishing', mode: 'polishing', iconName: 'palette' },
    { key: 'summarize', mode: 'summarize', iconName: 'summarize' },
    { key: 'analyze', mode: 'analyze', iconName: 'analytics' },
    { key: 'bubble', mode: 'bubble', iconName: 'bubble' },
  ])

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['bottom']}>
        <TitleBar title={t('Mode Result Records')} />
        <TabView
          style={stylez.f1}
          lazy={true}
          lazyPreloadDistance={1}
          navigationState={{ index: tabIndex, routes }}
          renderTabBar={options => {
            return (
              <TabBar
                {...options}
                style={stylez.tabViewBar}
                labelStyle={stylez.tabViewLabel}
                indicatorStyle={[stylez.tabViewIndicator, { backgroundColor: backgroundIndicator }]}
                activeColor={textActive}
                inactiveColor={textInactive}
                pressColor={colors.transparent}
                renderIcon={({ route, color }) => {
                  const { iconName } = route
                  return <SvgIcon size={dimensions.iconMedium} color={color} name={iconName} />
                }}
              />
            )
          }}
          renderScene={({ route }) => {
            const { key, mode } = route
            return <ModeResultScene key={key} mode={mode} />
          }}
          onIndexChange={setTabIndex}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  )
}
