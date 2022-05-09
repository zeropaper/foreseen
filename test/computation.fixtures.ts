import type { Functions } from "../src/compute";
import { Token } from "../src/tokenize";

export const $a = 1;
export const $b = 2;
export const $c = 3;
export const $d = 4;

export const data = Object.freeze({
  a: $a,
  b: $b,
  c: $c,
  d: $d,
})

export const fns: Functions = {
  frequency: jest.fn((value) => value),
  timeDomain: jest.fn((value) => value),
}

type ComputationFixtures = [
  string,
  Token[],
  number,
][];

const fixtures: ComputationFixtures = [
  [
    'nope(12)',
    [
      {
        function: 'nope',
        args: [
          { value: 12 }
        ]
      },
    ],
    0,
  ],
  [
    'frequency(12)',
    [
      {
        function: 'frequency',
        args: [
          { value: 12 }
        ]
      },
    ],
    12,
  ],
  [
    'timeDomain(12)',
    [
      {
        function: 'timeDomain',
        args: [
          { value: 12 }
        ]
      },
    ],
    12,
  ],
  [
    'min(1.2, max(0.2, (frequency(32) * 0.01)))',
    [
      {
        function: 'min',
        args: [
          { value: 1.2 },
          {
            function: 'max',
            args: [
              { value: 0.2 },
              {
                group: [
                  {
                    function: 'frequency',
                    args: [
                      { value: 32 }
                    ]
                  },
                  { operator: '*' },
                  { value: 0.01 },
                ]
              }
            ]
          },
        ]
      },
    ],
    0.32
  ],
  [
    'min(1.2, max(0.2, frequency(130) * 0.01))',
    [
      {
        function: 'min',
        args: [
          { value: 1.2 },
          {
            function: 'max',
            args: [
              { value: 0.2 },
              {
                group: [
                  {
                    function: 'frequency',
                    args: [
                      { value: 130 }
                    ]
                  },
                  { operator: '*' },
                  { value: 0.01 },
                ]
              }
            ]
          },
        ]
      },
    ],
    1.2
  ],
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
