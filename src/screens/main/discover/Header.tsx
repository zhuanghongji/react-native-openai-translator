import { SvgIcon } from '../../../components/SvgIcon'
import { colors } from '../../../res/colors'
import { dimensions } from '../../../res/dimensions'
import { useThemeScheme } from '../../../themes/hooks'
import React from 'react'
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

export type HeaderProps = {
  style?: StyleProp<ViewStyle>
  filterText: string
  onFilterTextChange: (value: string) => void
}

export function Header(props: HeaderProps) {
  const { style, filterText, onFilterTextChange } = props
  const { backgroundChat: backgroundColor, tint: iconColor } = useThemeScheme()

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={styles.wrapper}>
        <TextInput
          style={styles.text}
          value={filterText}
          numberOfLines={1}
          autoFocus={true}
          placeholder="Input to filter Awesome Prompts ..."
          onChangeText={onFilterTextChange}
        />
        {filterText ? (
          <Pressable hitSlop={dimensions.hitSlop} onPress={() => onFilterTextChange('')}>
            <SvgIcon size={dimensions.iconSmall} color={iconColor} name="close" />
          </Pressable>
        ) : null}
      </View>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  wrapper: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    paddingTop: dimensions.edge,
    paddingHorizontal: dimensions.edge,
  },
  wrapper: {
    flexDirection: 'row',
    height: 36,
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: colors.white,
    paddingHorizontal: dimensions.edge,
    paddingVertical: 0,
  },
  text: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
})
