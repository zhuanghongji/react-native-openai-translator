import { TText } from '../../components/TText'
import { dimensions } from '../../res/dimensions'
import { useTextThemeColor, useViewThemeColor } from '../../themes/hooks'
import { CheckView } from './CheckView'
import { InputView } from './InputView'
import { PickView } from './PickView'
import { TitleBar } from './TitleBar'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const DIVIDER_HEIGHT = 20

export function SettingsScreen(
  props: NativeStackScreenProps<RootStackParamList, 'Settings'>
): JSX.Element {
  const { navigation } = props

  const { bottom: bottomInset } = useSafeAreaInsets()
  const contentColor = useTextThemeColor('content')
  const backgroundColor = useViewThemeColor('background')

  const divider = <View style={{ height: DIVIDER_HEIGHT }} />

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }]} edges={['bottom']}>
      <TitleBar onBackPress={() => navigation.goBack()} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: dimensions.edge,
          paddingTop: DIVIDER_HEIGHT,
          paddingBottom: DIVIDER_HEIGHT * 3 + bottomInset,
        }}>
        <TText style={styles.title} type="text">
          Default Service Provider
        </TText>
        <PickView text="OpenAI" picking={false} onPress={() => {}} />

        {divider}
        <TText style={styles.title} type="text">
          * API Key
        </TText>
        <InputView securable={true} value={'ABC'} onChangeText={() => {}} />
        <Text style={[styles.desc, { color: contentColor }]}>
          <Text>{'Go to the '}</Text>
          <Text
            style={{ color: '#1E90FF', textDecorationLine: 'underline' }}
            onPress={() => {
              Linking.openURL('https://platform.openai.com/account/api-keys')
            }}>
            {'OpenAI Page'}
          </Text>
          <Text>
            {
              ' to get your API Key. You can separate multiple API Keys with English commas to achieve quota doubling and load balancing.'
            }
          </Text>
        </Text>

        {divider}
        <TText style={styles.title} type="text">
          API Model
        </TText>
        <PickView text="gpt-3.5-turbo" picking={false} onPress={() => {}} />

        {divider}
        <TText style={styles.title} type="text">
          API URL
        </TText>
        <InputView value={'ABC'} onChangeText={() => {}} />

        {divider}
        <TText style={styles.title} type="text">
          API URL Path
        </TText>
        <InputView value={'ABC'} onChangeText={() => {}} />

        {divider}
        <TText style={styles.title} type="text">
          Default Translate Mode
        </TText>
        <PickView text="Translate" picking={false} onPress={() => {}} />

        {divider}
        <TText style={styles.title} type="text">
          Default Target Language
        </TText>
        <PickView text="简体中文" picking={false} onPress={() => {}} />

        {divider}
        <TText style={styles.title} type="text">
          Theme
        </TText>
        <PickView text="Light" picking={false} onPress={() => {}} />

        {divider}
        <TText style={styles.title} type="text">
          Language
        </TText>
        <PickView text="English" picking={false} onPress={() => {}} />

        {divider}
        <CheckView
          title="Always show icons"
          value={false}
          onValueChange={() => {}}
        />

        {divider}
        <CheckView
          title="Auto Translate"
          value={false}
          onValueChange={() => {}}
        />

        {divider}
        <CheckView
          title="Restore Previous Position"
          value={false}
          onValueChange={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

type Styles = {
  title: TextStyle
  desc: TextStyle
}

const styles = StyleSheet.create<Styles>({
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  desc: {
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 6,
    textAlign: 'justify',
    marginHorizontal: 2,
  },
})
