import { analysisExp, analyze, getComputable } from "../src/analyze";
import { compute } from "../src/compute";

const fixtures = {
  '1-2': [[1, '-', 2], -1],
  '5%2': [[5, '%', 2], 1],
  '': [
    [],
    0
  ],
  '+': [
    ['+'],
    0
  ],
  '1': [
    [1],
    1
  ],
  '1+2': [
    [1, '+', 2],
    3
  ],
  '1 - 2': [
    [1, '-', 2],
    -1
  ],
  '1 + 2': [
    [1, '+', 2],
    3
  ],
  '-1 + -2': [
    [-1, '+', -2],
    -3
  ],
  '5 % 2': [
    [5, '%', 2],
    1
  ],
  '1 * 2': [
    [1, '*', 2],
    2
  ],
  '12 + (12 -12)': [
    [12, '+', [12, '-', 12]],
    12
  ],
  '(12) + (12 + 12)': [
    [[12], '+', [12, '+', 12]],
    36
  ],
  '12 + (12 + 12)': [
    [12, '+', [12, '+', 12]],
    36
  ],
  '13 + (14 + 15) + (16 + 17)': [
    [13, '+', [14, '+', 15], '+', [16, '+', 17]],
    75
  ],
  '1 + round(1 + 1.2)': [
    [1, '+', ['round', [1, '+', 1.2]]],
    3
  ],
  'round(1 + 1.2)': [
    [['round', [1, '+', 1.2]]],
    2
  ],
  'min(1, 2)': [
    [['min', [1], [2]]],
    1
  ],
  'max(1, 2 + 3)': [
    [['max', [1], [2, '+', 3]]],
    5
  ],
};

function getFixtureByIndex(index: number) {
  return Object.keys(fixtures).map((str) => [str, fixtures[str][index]]);
}

describe('analyze', () => {
  it.each(getFixtureByIndex(0))('processes %j', (str, expected) => {
    expect(analyze(str.match(analysisExp))).toEqual(expected);
  });
});

describe('compute', () => {
  it.each(getFixtureByIndex(1))('calculates %j (= %s)', (str, expected) => {
    expect(compute(str)).toEqual(expected);
  });

  it('does not alterate other strings', () => {
    expect(compute('some string')).toBe('some string')
  })
});

describe('getComputable', () => {
  it('returns an array or false', () => {
    expect(getComputable('11 + 12')).toEqual(['11', '+', '12']);
    expect(getComputable('1 + 2')).toEqual(['1', '+', '2']);
    expect(getComputable('1 - 2')).toEqual(['1', '-', '2']);
    expect(getComputable('1+2')).toEqual(['1', '+', '2']);
    expect(getComputable('1-2')).toEqual(['1', '-2']);
    console.info("getComputable('max(1, 3)')", getComputable('max(1, 3)'))
    expect(getComputable('some random string')).toEqual(false);
  })
})
