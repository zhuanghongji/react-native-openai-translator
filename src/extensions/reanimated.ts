export function workletClamp(value: number, min: number, max: number) {
  'worklet'
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}
