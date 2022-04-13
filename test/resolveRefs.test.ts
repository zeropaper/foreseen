import { resolveRefs } from '../src/resolveRefs';

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

describe('resolveRefs', () => {
  it('returns reference values', () => {
    const result = resolveRefs(yamlFixture)
    expect(result.at(-3).value).toBe(123)
    expect(result.at(-2).value).toBe(2)
    expect(result.at(-1).value).toBe(6)
  })
})
