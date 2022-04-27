import tokenize, { splitOperatorValues } from "../src/tokenize";
import tokenizeFixtures from "./computation.fixtures";

describe('splitOperatorValues', () => {
  it.each([
    [
      '',
      []
    ],
    [
      '1 + 2 * -2 -',
      [1, '+', 2, '*', -2, '-']
    ],
    [
      '1 + 2 * -2 - max',
      [1, '+', 2, '*', -2, '-', 'max']
    ],
  ])('splits "%s"', (input, expected) => {
    expect(splitOperatorValues(input)).toEqual(expected);
  })
})

describe.each(tokenizeFixtures)("tokenize %s", (input: string, expected: any) => {
  it('returns tokens', () => {
    const tokens = tokenize(input);
    expect(tokens).toEqual(expected);
  })
});