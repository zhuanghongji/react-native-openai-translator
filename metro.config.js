/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

// module.exports = {
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: true,
//       },
//     }),
//   },
// }

const { getDefaultConfig } = require('expo/metro-config')

const defaultConfig = getDefaultConfig(__dirname)

defaultConfig.resolver.assetExts.push('db')
// defaultConfig.transformer.getTransformOptions = async () => ({
//   transform: {
//     experimentalImportSupport: false,
//     inlineRequires: true,
//   },
// })

module.exports = defaultConfig
