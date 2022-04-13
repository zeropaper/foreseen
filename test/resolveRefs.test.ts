import { resolveRefs } from '../src/resolveRefs';
import { getFixtureContentSync } from './getFixtureContent';

const yamlFixture = getFixtureContentSync('references');

describe('resolveRefs', () => {
  it('returns reference values', () => {
    const result = resolveRefs(yamlFixture)
    expect(result.at(-3).value).toBe(1.23)
    expect(result.at(-2).value).toBe(2)
    expect(result.at(-1).value).toBe(6)
  })
})
