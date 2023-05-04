import { PickSelector } from '../../../components/PickSelector'
import {
  LANGUAGE_KEYS,
  LanguageKey,
  TranslatorMode,
  languageLabelByKey,
} from '../../../preferences/options'
import { dimensions } from '../../../res/dimensions'
import { PickView } from './PickView'
import React from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated'

export type ModeTargetLangSelectorsProps = {
  style?: StyleProp<ViewStyle>
  pageOffset: SharedValue<number>
  modes: TranslatorMode[]
  targetLangs: LanguageKey[]
  onTargetLangsChange: (langs: LanguageKey[]) => void
  onInputFocusRequest: () => void
}

const HEIGHT = 32

export function ModeTargetLangSelectors(props: ModeTargetLangSelectorsProps) {
  const { style, pageOffset, modes, targetLangs, onTargetLangsChange, onInputFocusRequest } = props

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -HEIGHT * pageOffset.value,
        },
      ],
    }
  })

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.content, animStyle]}>
        {modes.map((mode, index) => {
          const isBubble = mode === 'bubble'
          const targetLang = targetLangs[index]
          return (
            <PickSelector
              key={`${index}_${mode}`}
              style={{ opacity: isBubble ? dimensions.disabledOpacity : 1 }}
              labelStyle={styles.pickLabel}
              value={targetLang}
              values={LANGUAGE_KEYS}
              disabled={isBubble}
              valueToLabel={value => (isBubble ? 'AUTO' : languageLabelByKey(value))}
              renderContent={({ label, anim }) => <PickView anim={anim} label={label} />}
              onValueChange={lang => {
                const nextLangs = [...targetLangs]
                nextLangs[index] = lang
                onTargetLangsChange(nextLangs)
              }}
              onDismiss={onInputFocusRequest}
            />
          )
        })}
      </Animated.View>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  content: ViewStyle
  pickLabel: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: 72,
    height: HEIGHT,
    borderRadius: 4,
    overflow: 'hidden',
  },
  content: {
    width: 72,
  },
  pickLabel: {
    fontSize: 11,
    marginHorizontal: 6,
  },
})
