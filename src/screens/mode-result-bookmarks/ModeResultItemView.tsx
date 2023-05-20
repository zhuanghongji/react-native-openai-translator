import { TModeResult } from '../../db/types'
import { LanguageKey, languageLabelByKey } from '../../preferences/options'
import { dimensions } from '../../res/dimensions'
import { TText } from '../../themes/TText'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

export type ModeResultItemViewProps = {
  style?: StyleProp<ViewStyle>
  item: TModeResult
  onPress: (item: TModeResult) => void
}

export function ModeResultItemView(props: ModeResultItemViewProps) {
  const { style, item, onPress } = props
  const { user_content, assistant_content, target_lang, update_time } = item

  return (
    <Pressable style={[styles.container, style]} onPress={() => onPress(item)}>
      <View style={styles.row1}>
        <TText style={styles.t1} typo="text" numberOfLines={1}>
          {user_content}
        </TText>
        <TText style={styles.t3} typo="text4" numberOfLines={1}>
          {update_time}
        </TText>
      </View>
      <View style={styles.row2}>
        <TText style={styles.t2} typo="text3" numberOfLines={1}>
          {assistant_content.replace(/\n/g, ' ')}
        </TText>
        <TText style={styles.t4} typo="text4">
          {languageLabelByKey(target_lang as LanguageKey)}
        </TText>
      </View>
    </Pressable>
  )
}

type Styles = {
  container: ViewStyle
  row1: ViewStyle
  row2: ViewStyle
  t1: TextStyle
  t2: TextStyle
  t3: TextStyle
  t4: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: dimensions.itemHeight,
    paddingVertical: 10,
    paddingHorizontal: dimensions.edge,
  },
  row1: {
    flexDirection: 'row',
  },
  row2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  t1: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  t2: {
    flex: 1,
    fontSize: 13,
  },
  t3: {
    fontSize: 12,
    marginLeft: dimensions.edge,
    marginTop: 3,
  },
  t4: {
    fontSize: 12,
    marginLeft: dimensions.edge,
  },
})
