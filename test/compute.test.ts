import compute, { resolveData, resolveToken } from "../src/compute";
import computationFixtures, { data, fns } from "./computation.fixtures";

describe('resolveData', () => {
  it('resolves "$a"', () => {
    expect(resolveData('$a', data)).toBe(data.a);
  });
  it('resolves "$b"', () => {
    expect(resolveData('$b', data)).toBe(data.b);
  });
  it('resolves "$b"', () => {
    expect(resolveData('$b', data)).toBe(data.b);
  });
  it('resolves "$c"', () => {
    expect(resolveData('$c', data)).toBe(data.c);
  });
  it('resolves "$d"', () => {
    expect(resolveData('$d', data)).toBe(data.d);
  });
  it('resolves "1.1"', () => {
    expect(resolveData(1.1, data)).toBe(1.1);
  });
});

describe('resolveToken', () => {
  it.each([
    [
      { value: '$a' },
      data.a
    ],
    [
      {
        function: 'max',
        args: [
          { value: '$a' },
          { value: '$b' },
        ],
      },
      data.b,
    ],
    [
      {
        group: [
          { value: '$a' },
          { operator: '+' },
          { value: '$b' },
        ]
      },
      data.a + data.b
    ]
  ])(`resolves %j to %s`, (token, expected) => {
    const result = resolveToken(token as any, data, fns);
    expect(result).toBe(expected)
  });
});

describe.each(computationFixtures)('expression "%s"', (name, tokens, expected) => {
  it(`computes to ${expected}`, () => {
    expect(compute(tokens, data, fns)).toBe(expected);
  });
});
