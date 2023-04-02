import { TranslateMode } from '../preferences/options'
import type { ScanBlock } from '../types'

type RootStackParamList = {
  Home: undefined
  Settings: undefined
  Scanner: {
    onScanSuccess: (blocks: ScanBlock[]) => void
  }
  Chat: {
    mode: TranslateMode
  }
}
