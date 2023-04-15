import { TranslatorMode } from '../preferences/options'
import type { ScanBlock } from '../types'

type RootStackParamList = {
  Home: undefined
  Settings: undefined
  Scanner: {
    onScanSuccess: (blocks: ScanBlock[]) => void
  }
  ModeChat: {
    translatorMode: TranslatorMode
    systemPrompt: string
    userContent: string
    assistantContent: string
  }
}
