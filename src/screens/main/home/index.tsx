import { SvgIcon, SvgIconName } from '../../../components/SvgIcon'
import { TitleBar } from '../../../components/TitleBar'
import { AnimatedPagerView, usePageScrollHandler } from '../../../extensions/pager-view'
import { LanguageKey, TranslatorMode } from '../../../preferences/options'
import { getDefaultTargetLanguage, getDefaultTranslatorMode } from '../../../preferences/storages'
import { dimensions } from '../../../res/dimensions'
import { images } from '../../../res/images'
import { TText } from '../../../themes/TText'
import { useThemeScheme } from '../../../themes/hooks'
import { ScanBlock } from '../../../types'
import type { MainTabScreenProps } from '../../screens'
import { ModeButton } from './ModeButton'
import { ModeScene, ModeSceneHandle } from './ModeScene'
import { ModeTargetLangSelectors } from './ModeTargetLangSelectors'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Image, ImageStyle, Keyboard, StyleSheet, View, ViewStyle } from 'react-native'
import PagerView from 'react-native-pager-view'
import { useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = MainTabScreenProps<'Modes'>

interface ModeItem {
  icon: SvgIconName
  mode: TranslatorMode
}

const MODE_ITEMS: ModeItem[] = [
  {
    icon: 'language',
    mode: 'translate',
  },
  {
    icon: 'palette',
    mode: 'polishing',
  },
  {
    icon: 'summarize',
    mode: 'summarize',
  },
  {
    icon: 'analytics',
    mode: 'analyze',
  },
  {
    icon: 'bubble',
    mode: 'bubble',
  },
]
const MODES = MODE_ITEMS.map(v => v.mode)

export function HomeScreen({ navigation }: Props): JSX.Element {
  const { tint2, background: backgroundColor } = useThemeScheme()

  const initialModeIndex = useMemo(() => {
    const mode = getDefaultTranslatorMode()
    const index = MODE_ITEMS.findIndex(v => v.mode === mode)
    return index < 0 ? 0 : index
  }, [])
  const [currentModeIndex, setCurrentModeIndex] = useState(initialModeIndex)
  const isBubble = MODE_ITEMS[currentModeIndex]?.mode === 'bubble'

  const [targetLangs, setTargetLangs] = useState<LanguageKey[]>(() => {
    const lang = getDefaultTargetLanguage()
    return MODES.map(_ => lang)
  })

  const pagerViewRef = useRef<PagerView>(null)
  const pageOffset = useSharedValue(initialModeIndex)
  const pageScrollHandler = usePageScrollHandler({
    onPageScroll: e => {
      'worklet'
      pageOffset.value = e.position + e.offset
    },
  })

  const modeSceneRefs = useRef<(ModeSceneHandle | null)[]>([])
  const inputFocus = useCallback(() => {
    // print('inputFocus', { currentModeIndex })
    modeSceneRefs.current[currentModeIndex]?.inputFocus()
  }, [currentModeIndex])

  // auto focus after scan success
  const scanSuccessRef = useRef(false)
  useEffect(() => {
    if (!scanSuccessRef.current) {
      return
    }
    scanSuccessRef.current = false
    const timer = setTimeout(inputFocus, 300)
    return () => clearTimeout(timer)
  }, [inputFocus])

  const onScanSuccess = (blocks: ScanBlock[]) => {
    const content = blocks
      .map(block => block.text)
      .join('\n')
      .trim()
    if (!content) {
      return
    }
    scanSuccessRef.current = true
    modeSceneRefs.current[currentModeIndex]?.inputText(content)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['bottom']}>
      <TitleBar
        backDisabled
        titleContainerRow
        action={{
          iconName: 'scanner',
          onPress: () => {
            Keyboard.dismiss()
            navigation.push('Scanner', { onScanSuccess })
          },
        }}
        renderTitle={({ titleStyle }) => (
          <>
            <Image style={styles.logo} source={images.logo} />
            <TText style={[titleStyle, { marginLeft: 8 }]} typo="text">
              OpenAI Translator
            </TText>
          </>
        )}
      />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: dimensions.edge,
        }}>
        <View style={styles.modes}>
          {MODE_ITEMS.map((item, index) => {
            const { icon, mode } = item
            return (
              <ModeButton
                key={`${index}_${mode}`}
                index={index}
                icon={icon}
                mode={mode}
                pageOffset={pageOffset}
                onPress={() => pagerViewRef.current?.setPage(index)}
              />
            )
          })}
        </View>
        <View style={{ flex: 1 }} />
        <SvgIcon
          style={{ opacity: isBubble ? 0.4 : 1, marginHorizontal: 4 }}
          size={dimensions.iconSmall}
          color={tint2}
          name="line-end"
        />
        <ModeTargetLangSelectors
          pageOffset={pageOffset}
          modes={MODES}
          targetLangs={targetLangs}
          onTargetLangsChange={setTargetLangs}
          onInputFocusRequest={inputFocus}
        />
      </View>

      <AnimatedPagerView
        ref={pagerViewRef}
        style={{ flex: 1 }}
        initialPage={initialModeIndex}
        onPageScroll={pageScrollHandler}
        onPageSelected={e => setCurrentModeIndex(e.nativeEvent.position)}>
        {MODE_ITEMS.map((item, index) => {
          const { mode } = item
          const focused = index === currentModeIndex
          return (
            <ModeScene
              key={`${index}_${mode}`}
              ref={ref => (modeSceneRefs.current[index] = ref)}
              focused={focused}
              targetLang={targetLangs[index]}
              translatorMode={mode}
            />
          )
        })}
      </AnimatedPagerView>
    </SafeAreaView>
  )
}

type Styles = {
  modes: ViewStyle
  logo: ImageStyle
}

const styles = StyleSheet.create<Styles>({
  modes: {
    flexDirection: 'row',
    gap: dimensions.gap,
    marginRight: dimensions.edge,
  },
  logo: {
    width: 20,
    height: 20,
  },
})
