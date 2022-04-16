import { load } from 'yaml-ast-parser';
import { resolveRefs } from '../src/resolveRefs';
import { getFixtureContentSync } from './getFixtureContent';

const yamlFixture = getFixtureContentSync('references');

const checks = [
  ['string', 'thats a string'],
  ['number', 1.23],
  // ['boolean', true],
  // ['object', { a: 1, b: 2 }],
  // ['array', [1, 2, 3]],
  // ['null', null],
  // ['otherObject', { a: 1, b: 2 }],
  // ['otherArray', ['a', 'b']],
  // ['reference', 1.23],
  // ['expressionA', 2],
  // ['expressionB', 6],
]

describe('resolveRefs', () => {
  let result;
  beforeAll(() => {
    result = resolveRefs(load(yamlFixture)) as any
  })

  it.each(checks.map((item, idx) => [item[1], item[0], idx]))('returns %j for "%s"', (expected: any, key: string, idx: number) => {
    expect(result?.mappings[idx]).toHaveProperty(`key.value`, key)
    expect(result?.mappings[idx]).toHaveProperty(`value.valueProcessed`, expected)
  })

  it.skip('matches snapshot', () => {
    expect(result.mappings).toMatchSnapshot('resolveRefs')
  })
})
