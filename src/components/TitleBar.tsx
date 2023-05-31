import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { RootStackParamList } from '../screens/screens'
import { TText } from '../themes/TText'
import { useStatusBarStyle, useThemeScheme } from '../themes/hooks'
import { SvgIcon, SvgIconName } from './SvgIcon'
import { NavigationProp, useNavigation } from '@react-navigation/native'
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

const H_EDGE = 8
const ACTION_WIDTH = 36

export interface TitleBarAction {
  disabled?: boolean
  iconSize?: number
  iconColor?: string
  iconName: SvgIconName
  onPress: () => void
}

export interface TitleBarProps {
  style?: StyleProp<ViewStyle>
  title?: string
  subtitle?: string
  backHidden?: boolean
  closeHidden?: boolean
  titleContainerRow?: boolean
  titleContainerNarrow?: boolean
  bottomLine?: boolean
  action?: TitleBarAction
  onBackPress?: () => void
  onClosePress?: () => void
  renderTitle?: (options: { titleStyle: TextStyle; subtitleStyle: TextStyle }) => React.ReactNode
  renderAction?: () => React.ReactNode
}
export function TitleBar(props: TitleBarProps): JSX.Element {
  const {
    style,
    title,
    subtitle,
    backHidden = false,
    closeHidden = true,
    titleContainerRow = false,
    titleContainerNarrow = false,
    bottomLine = false,
    action,
    onBackPress,
    onClosePress,
    renderTitle,
    renderAction,
  } = props
  const { top } = useSafeAreaInsets()

  const barStyle = useStatusBarStyle()
  const { tint: tintColor, divider } = useThemeScheme()

  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
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
    const {
      disabled = false,
      iconSize = dimensions.iconMedium,
      iconColor = tintColor,
      iconName,
      onPress,
    } = action
    return (
      <Pressable
        style={styles.touchable}
        hitSlop={{ left: dimensions.edge, right: H_EDGE }}
        disabled={disabled}
        onPress={onPress}>
        <SvgIcon size={iconSize} color={iconColor} name={iconName} />
      </Pressable>
    )
  }

  const touchableRowWidth = ACTION_WIDTH * (titleContainerNarrow ? 2 : 1)
  return (
    <View
      style={[
        styles.container,
        {
          height: dimensions.barHeight + top,
          paddingTop: top,
          borderBottomColor: bottomLine ? `${divider}99` : colors.transparent,
        },
        style,
      ]}>
      <StatusBar translucent barStyle={barStyle} backgroundColor={colors.transparent} />
      <View style={[styles.touchableRow, { width: touchableRowWidth }]}>
        {backHidden ? (
          <View style={styles.touchable} />
        ) : (
          <Pressable
            style={styles.touchable}
            hitSlop={{ left: H_EDGE, right: closeHidden ? H_EDGE : 0 }}
            onPress={onBackPress ?? goBack}>
            <SvgIcon size={dimensions.iconMedium} color={tintColor} name="back" />
          </Pressable>
        )}
        {closeHidden ? null : (
          <Pressable style={styles.touchable} hitSlop={{ right: H_EDGE }} onPress={onClosePress}>
            <SvgIcon size={dimensions.iconLarge} color={tintColor} name="close" />
          </Pressable>
        )}
      </View>

      <Pressable
        style={[styles.center, { flexDirection: titleContainerRow ? 'row' : 'column' }]}
        disabled={!__DEV__}
        onLongPress={() => __DEV__ && navigation.navigate('Dev')}>
        {_renderTitle()}
      </Pressable>

      <View style={[styles.touchableRow, { width: touchableRowWidth, justifyContent: 'flex-end' }]}>
        {closeHidden ? null : <View style={styles.touchable} />}
        {_renderAction()}
      </View>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  touchableRow: ViewStyle
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  touchableRow: {
    flexDirection: 'row',
    width: ACTION_WIDTH * 2,
    height: dimensions.barHeight,
  },
  touchable: {
    width: ACTION_WIDTH,
    height: dimensions.barHeight,
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
