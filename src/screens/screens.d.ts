type RootStackParamList = {
  Home: undefined
  Settings: undefined
  Scanner: {
    onScanSuccess: (data: { text: string; lang: string }) => void
  }
}
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
