import * as fs from 'fs'

const UTF8 = 'utf-8'

function trim(value: string): string {
  const _value = value.trim()
  if (_value.length < 2) {
    return ''
  }
  return _value.substring(1, _value.length - 1)
}

type Prompt = { title: string; content: string }

function main() {
  const csv = fs.readFileSync('./scripts/parse-prompts/prompts.csv', UTF8)
  const items = csv.split('\n')
  const prompts: Prompt[] = []
  for (const item of items) {
    const [title, content] = item.split(',')
    if (!title || !content) {
      continue
    }
    // console.log('title = ' + trim(title))
    // console.log('content = ' + trim(content))
    prompts.push({ title: trim(title).replace(/`/g, ''), content: trim(content) })
  }
  console.log(JSON.stringify(prompts))
}

main()
