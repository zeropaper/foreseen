import { parse } from '../src/index'

const yamlFixture = `string: thats a string
#comment
number: 123
number: 1.23
boolean: true
object: { a: 1, b: 2 }
array: [1, 2, 3]
null: null
otherObject:
  - a: 1
  - b: 2
otherArray:
  - a
  - b
reference: $/number
expressionA: |
  $/object/a * 2
expressionB: '$/object/b * 3'
`;

describe('foreseen', () => {
  let result;
  beforeEach(() => { result = parse(yamlFixture) })
  // const mock = jest.fn(parse)
  // beforeEach(() => { result = mock(yamlFixture) })

  it('returns an object', () => {
    expect(result).toHaveProperty('setup')
    expect(result).toHaveProperty('render')
    expect(result).toHaveProperty('teardown')
  })

  describe('lifecyle', () => {
    it('requires setup to be called', async () => {
      expect(() => result.render()).toThrow('setup must be called before render')
      await expect(() => result.teardown()).rejects.toThrow('setup must be called before render')
    })

    describe('setup', () => {
      let setupResult;

      it('returns a promise', async () => {
        setupResult = result.setup()
        expect(setupResult).toBeInstanceOf(Promise)
      })

      it('can be only called once', async () => {
        await expect(result.setup).rejects.toThrow('setup can only be called once')
      })

      it('resolves', async () => {
        await expect(setupResult).resolves.toBeTruthy()
      })
    })
  })
})