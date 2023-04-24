import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { TText } from '../../themes/TText'
import React from 'react'
import { Linking, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export type RepoLinksProps = {
  style?: StyleProp<ViewStyle>
}

export function RepoLinks(props: RepoLinksProps) {
  const { style } = props

  return (
    <View style={[styles.container, style]}>
      <TText style={styles.text} typo={'text'}>
        INSPIRED BY
      </TText>
      <Text
        style={styles.link}
        onPress={() => {
          Linking.openURL('https://github.com/yetone/openai-translator')
        }}>
        openai-translator
      </Text>
      <TText style={styles.text} typo={'text'}>
        OPEN SOURCE CODE IN
      </TText>
      <Text
        style={styles.link}
        onPress={() => {
          Linking.openURL('https://github.com/zhuanghongji/react-native-openai-translator')
        }}>
        react-native-openai-translator
      </Text>
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
