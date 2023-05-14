import { SvgIconName } from '../components/SvgIcon'

export function getModeIconName(mode: string): SvgIconName {
  switch (mode) {
    case 'translate':
      return 'language'
    case 'polishing':
      return 'palette'
    case 'summarize':
      return 'summarize'
    case 'analyze':
      return 'analytics'
    case 'bubble':
      return 'bubble'
    default:
      return 'language'
  }
}
