const fs = require('fs')

const content = fs.readFileSync(
  './ios/ReactNativeOpenAITranslator.xcodeproj/project.pbxproj',
  'utf-8'
)

const count1 = (content.match(/DEVELOPMENT_TEAM/g) || []).length
const count2 = (content.match(/DEVELOPMENT_TEAM = "";/g) || []).length

if (count1 !== count2) {
  console.error(
    'Error: DEVELOPMENT_TEAM setting found in ./ios/ReactNativeOpenAITranslator.xcodeproj/project.pbxproj file. Please remove it or set Signing Team to None in Xcode and try again.'
  )
  process.exit(1)
}
process.exit(0)
