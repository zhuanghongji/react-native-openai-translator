import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { TText } from '../../themes/TText'
import { RootStackParamList } from '../screens'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { nativeApplicationVersion } from 'expo-application'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export type InfosViewProps = {
  style?: StyleProp<ViewStyle>
}

export function InfosView(props: InfosViewProps) {
  const { style } = props

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  return (
    <View style={[styles.container, style]}>
      <TText style={styles.text} typo={'text'}>
        INSPIRED BY
      </TText>
      <Text
        style={styles.link}
        onPress={() => {
          navigation.push('Web', {
            title: 'openai-translator',
            url: 'https://github.com/yetone/openai-translator',
          })
        }}>
        openai-translator
      </Text>
      <TText style={styles.text} typo={'text'}>
        OPEN SOURCE CODE IN
      </TText>
      <Text
        style={styles.link}
        onPress={() => {
          navigation.push('Web', {
            title: 'react-native-openai-translator',
            url: 'https://github.com/zhuanghongji/react-native-openai-translator',
          })
        }}>
        react-native-openai-translator
      </Text>

      <TText style={{ fontSize: 13, marginTop: dimensions.edge }} typo="text">
        {`V${nativeApplicationVersion}`}
      </TText>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  text: TextStyle
  link: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    paddingTop: dimensions.edgeTriple,
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    marginTop: dimensions.edge,
  },
  link: {
    color: colors.link,
    textDecorationLine: 'underline',
  },
})
