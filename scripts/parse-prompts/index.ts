import * as fs from 'fs'

const UTF8 = 'utf-8'

function trans(value: string): string {
  // return value.replace(/`/g, '\\`')
  return value
}

type Prompt = { title: string; content: string }

function main() {
  const csv = fs.readFileSync('./scripts/parse-prompts/prompts.csv', UTF8)
  const items = csv.split('\n')
  const prompts: Prompt[] = []
  for (const item of items) {
    const [title, content] = item.substring(1, item.length - 1).split('","')
    if (!title || !content) {
      continue
    }
    // console.log('title = ' + trans(title))
    // console.log('content = ' + trans(content))
    prompts.push({ title: trans(title), content: trans(content) })
  }
  console.log(JSON.stringify(prompts))
}

main()
