export function print(message: string, params?: any) {
  if (!__DEV__) {
    return
  }
  const paramsPrefix = params ? ': ' : ''
  const paramsStr = params ? JSON.stringify(params, undefined, '  ') : ''
  console.log(message, paramsPrefix, paramsStr)
}
