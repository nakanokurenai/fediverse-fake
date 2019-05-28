import * as t from 'io-ts'
import { left, right } from 'fp-ts/lib/Either'

const ConfigValidator = t.type({
  workspace: t.string,
  token: t.string,
})
const Config = (env: {[k: string]: string | undefined}) => {
  const { SLACK_WORKSPACE: workspace, TOKEN: token } = env
  return ConfigValidator.decode({
    workspace,
    token
  })
}

async function main () {
  const r = Config(process.env).chain(c => {
    console.dir(c)
    return right(null)
  })
  if (r.isLeft()) {
    r.value.map(console.error)
    process.exit(1)
  }
}

main().catch(console.error)
