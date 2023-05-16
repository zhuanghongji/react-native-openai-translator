import { TEnglishWord } from '../../db/table/t-english-word'
import { LanguageKey, languageLabelByKey } from '../../preferences/options'
import { dimensions } from '../../res/dimensions'
import { TText } from '../../themes/TText'
import React from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

export type EnglishWrodItemViewProps = {
  style?: StyleProp<ViewStyle>
  item: TEnglishWord
}

export function EnglishWrodItemView(props: EnglishWrodItemViewProps) {
  const { style, item } = props
  const { user_content, assistant_content, target_lang, update_time } = item
  return (
    <View style={[styles.container, style]}>
      <TText style={styles.userContent} typo="text" numberOfLines={1}>
        {user_content}
      </TText>
      <TText style={styles.assistantContent} typo="text3" numberOfLines={1}>
        {assistant_content.replace(/\n/g, ' ')}
      </TText>
      <View style={styles.updateTimeContainer}>
        <TText style={styles.updateTime} typo="text4" numberOfLines={1}>
          {`${languageLabelByKey(target_lang as LanguageKey)} ${update_time}`}
        </TText>
      </View>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  userContent: TextStyle
  assistantContent: TextStyle
  updateTimeContainer: TextStyle
  updateTime: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: 84,
    paddingVertical: 6,
    paddingHorizontal: dimensions.edge,
  },
  userContent: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  assistantContent: {
    fontSize: 14,
    marginTop: 4,
  },
  updateTimeContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  updateTime: {
    fontSize: 12,
  },
})
