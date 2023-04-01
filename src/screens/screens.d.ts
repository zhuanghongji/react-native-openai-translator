import type { ScanBlock } from '../types'

type RootStackParamList = {
  Home: undefined
  Settings: undefined
  Scanner: {
    onScanSuccess: (blocks: ScanBlock[]) => void
  }
}
