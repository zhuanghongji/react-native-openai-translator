import { SvgIcon } from '../../components/SvgIcon'
import { TModeResult } from '../../db/table/t-mode-result'
import { getModeIconName } from '../../manager/mode'
import { LanguageKey, languageLabelByKey } from '../../preferences/options'
import { dimensions } from '../../res/dimensions'
import { TText } from '../../themes/TText'
import { useThemeScheme } from '../../themes/hooks'
import React from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

export type ModeResultItemViewProps = {
  style?: StyleProp<ViewStyle>
  item: TModeResult
}

export function ModeResultItemView(props: ModeResultItemViewProps) {
  const { style, item } = props
  const { mode, user_content, assistant_content, target_lang, update_time } = item

  const { text4 } = useThemeScheme()

  return (
    <View style={[styles.container, style]}>
      <TText style={styles.userContent} typo="text" numberOfLines={1}>
        {user_content}
      </TText>
      <TText style={styles.assistantContent} typo="text3" numberOfLines={1}>
        {assistant_content.replace(/\n/g, ' ')}
      </TText>
      <View style={styles.updateTimeContainer}>
        <View style={styles.updateTimeRow}>
          <SvgIcon size={12} color={text4} name={getModeIconName(mode)} />
          <TText style={styles.updateTime} typo="text4" numberOfLines={1}>
            {` ${languageLabelByKey(target_lang as LanguageKey)} ${update_time}`}
          </TText>
        </View>
      </View>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  userContent: TextStyle
  assistantContent: TextStyle
  updateTimeContainer: TextStyle
  updateTimeRow: TextStyle
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
  updateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateTime: {
    fontSize: 12,
  },
})
