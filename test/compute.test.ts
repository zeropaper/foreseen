import compute, { resolveData, resolveToken } from "../src/compute";
import computationFixtures, { $a, $b, $c, $d } from "./computation.fixtures";


const data = Object.freeze({
  a: $a,
  b: $b,
  c: $c,
  d: $d,
})

describe('resolveData', () => {
  it('resolves "$a"', () => {
    expect(resolveData('$a', data)).toBe($a);
  });
  it('resolves "$b"', () => {
    expect(resolveData('$b', data)).toBe($b);
  });
  it('resolves "$b"', () => {
    expect(resolveData('$b', data)).toBe($b);
  });
  it('resolves "$c"', () => {
    expect(resolveData('$c', data)).toBe($c);
  });
  it('resolves "$d"', () => {
    expect(resolveData('$d', data)).toBe($d);
  });
  it('resolves "1.1"', () => {
    expect(resolveData(1.1, data)).toBe(1.1);
  });
});

describe('resolveToken', () => {
  it.each([
    [
      { value: '$a' },
      $a
    ],
    [
      {
        function: 'max',
        args: [
          { value: '$a' },
          { value: '$b' },
        ],
      },
      $b,
    ],
    [
      {
        group: [
          { value: '$a' },
          { operator: '+' },
          { value: '$b' },
        ]
      },
      $a + $b
    ]
  ])(`resolves %j to %s`, (token, expected) => {
    const result = resolveToken(token as any, data);
    expect(result).toBe(expected)
  });
});

describe.each(computationFixtures)('expression "%s"', (name, tokens, expected) => {
  it(`computes to ${expected}`, () => {
    expect(compute(tokens, data)).toBe(expected);
  });
});
