import { Token } from "../src/tokenize";

export const $a = 1;
export const $b = 2;
export const $c = 3;
export const $d = 4;

type ComputationFixtures = [
  string,
  Token[],
  number,
][];

const fixtures: ComputationFixtures = [
  [
    '$a',
    [
      { value: '$a' },
    ],
    $a,
  ],
  [
    '$a + $b',
    [
      { value: '$a' },
      { operator: '+' },
      { value: '$b' },
    ],
    $a + $b,
  ],
  [
    'max($a, $b)',
    [
      {
        function: 'max',
        args: [
          { value: '$a' },
          { value: '$b' },
        ],
      }
    ],
    Math.max($a, $b),
  ],
  [
    '$a + -1',
    [
      { value: '$a' },
      { operator: '+' },
      { value: -1 },
    ],
    $a + -1,
  ],
  [
    '$a + $b * $c',
    [
      { value: '$a' },
      { operator: '+' },
      { value: '$b' },
      { operator: '*' },
      { value: '$c' },
    ],
    ($a + $b) * $c,
  ],
  [
    '($a + $b) * $c',
    [
      {
        group: [
          { value: '$a' },
          { operator: '+' },
          { value: '$b' },
        ],
      },
      { operator: '*' },
      { value: '$c' },
    ],
    ($a + $b) * $c,
  ],
  [
    '$a + ($b * $c)',
    [
      { value: '$a' },
      { operator: '+' },
      {
        group: [
          { value: '$b' },
          { operator: '*' },
          { value: '$c' },
        ]
      },
    ],
    $a + ($b * $c),
  ],
  [
    '1+max($a, 2) + ($b * $c)',
    [
      { value: 1 },
      { operator: '+' },
      {
        function: 'max',
        args: [
          { value: '$a' },
          { value: 2 },
        ],
      },
      { operator: '+' },
      {
        group: [
          { value: '$b' },
          { operator: '*' },
          { value: '$c' },
        ]
      },
    ],
    1 + Math.max($a, 2) + ($b * $c),
  ],
  [
    '1 + 2 * -2 - max($a, sin(2)) + (($b + 1) * $c)',
    [
      { value: 1 },
      { operator: '+' },
      { value: 2 },
      { operator: '*' },
      { value: -2 },
      { operator: '-' },
      {
        function: 'max',
        args: [
          { value: '$a' },
          {
            function: 'sin',
            args: [
              { value: 2 },
            ],
          },
        ],
      },
      { operator: '+' },
      {
        group: [
          {
            group: [
              { value: '$b' },
              { operator: '+' },
              { value: 1 },
            ]
          },
          { operator: '*' },
          { value: '$c' },
        ]
      },
    ],
    ((1 + 2) * -2) - Math.max($a, Math.sin(2)) + (($b + 1) * $c),
  ],
];

export default fixtures;
