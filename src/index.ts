import { compute } from './compute'
import { analyze } from './analyze'

let init = false

// TODO: memoize
function parse(input: string) {
  // TODO: data
  return {
    setup: async () => {
      if (init) throw new Error('setup can only be called once')
      init = true
      return true
    },
    render: () => {
      if (!init) throw new Error('setup must be called before render')
    },
    teardown: async () => {
      if (!init) throw new Error('setup must be called before render')
      init = false
    },
  }
}

export { parse, analyze, compute }
