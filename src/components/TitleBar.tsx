import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { TText } from '../themes/TText'
import { useStatusBarStyle, useThemeScheme } from '../themes/hooks'
import { SvgIcon, SvgIconName } from './SvgIcon'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import {
  Pressable,
  StatusBar,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface TitleBarAction {
  iconSize?: number
  iconColor?: string
  iconName: SvgIconName
  onPress: () => void
}

export interface TitleBarProps {
  style?: StyleProp<ViewStyle>
  title?: string
  subtitle?: string
  backDisabled?: boolean
  titleContainerRow?: boolean
  action?: TitleBarAction
  onBackPress?: () => void
  renderTitle?: (options: { titleStyle: TextStyle; subtitleStyle: TextStyle }) => React.ReactNode
  renderAction?: () => React.ReactNode
}

const H_EDGE = 8

export function TitleBar(props: TitleBarProps): JSX.Element {
  const {
    style,
    title,
    subtitle,
    backDisabled = false,
    titleContainerRow = false,
    action,
    onBackPress,
    renderTitle,
    renderAction,
  } = props
  const { top } = useSafeAreaInsets()

  const barStyle = useStatusBarStyle()
  const { tint: tintColor } = useThemeScheme()

  const navigation = useNavigation()
  const goBack = useCallback(() => {
    navigation.canGoBack() && navigation.goBack()
  }, [navigation])

  const _renderTitle = () => {
    if (renderTitle) {
      return renderTitle({ titleStyle: styles.title, subtitleStyle: styles.subtitle })
    }
    return (
      <>
        <TText
          style={subtitle ? styles.titleSmaller : styles.title}
          typo="text"
          numberOfLines={subtitle ? 1 : 2}>
          {title}
        </TText>
        {subtitle ? (
          <TText style={styles.subtitle} numberOfLines={1} typo="text2">
            {subtitle}
          </TText>
        ) : null}
      </>
    )
  }

  const _renderAction = () => {
    if (renderAction) {
      return renderAction()
    }
    if (!action) {
      return <View style={styles.touchable} />
    }
    const { iconSize = dimensions.iconMedium, iconColor = tintColor, iconName, onPress } = action
    return (
      <Pressable style={styles.touchable} hitSlop={{ right: H_EDGE }} onPress={onPress}>
        <SvgIcon size={iconSize} color={iconColor} name={iconName} />
      </Pressable>
    )
  }

  return (
    <View
      style={[styles.container, { height: dimensions.barHeight + top, paddingTop: top }, style]}>
      <StatusBar translucent barStyle={barStyle} backgroundColor={colors.transparent} />
      <Pressable
        style={styles.touchable}
        hitSlop={{ right: H_EDGE }}
        disabled={backDisabled}
        onPress={onBackPress ?? goBack}>
        {backDisabled ? null : (
          <SvgIcon size={dimensions.iconMedium} color={tintColor} name="back" />
        )}
      </Pressable>
      <View style={[styles.center, { flexDirection: titleContainerRow ? 'row' : 'column' }]}>
        {_renderTitle()}
      </View>
      {_renderAction()}
    </View>
  )
}

type Styles = {
  container: ViewStyle
  touchable: ViewStyle
  center: ViewStyle
  title: TextStyle
  titleSmaller: TextStyle
  subtitle: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: H_EDGE,
  },
  touchable: {
    width: 36,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleSmaller: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
  },
})
