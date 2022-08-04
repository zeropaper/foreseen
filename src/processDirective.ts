import deepmerge from 'deepmerge';
import { safeArgsSplit } from './tokenize';

type OG = { [k: string]: any; };

export type OriginalObject = OG;

function recusrsiveReplace(obj: OG, searched: string, replace: string | number) {
  const newObj: OG = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        newObj[key] = recusrsiveReplace(obj[key], searched, replace);
      } else if (typeof obj[key] === 'string') {
        newObj[key] = obj[key].split(searched).join(replace);
      }
    }
  }
  return newObj;
}



export function parseCopyOptions([name, count = '1']: string[]) {
  return {
    name,
    count: Number(count),
  };
}

const optionsParsers = {
  copy: parseCopyOptions,
};

type ParserName = keyof typeof optionsParsers;


type ParserOptions<T extends ParserName> =
  T extends ParserName ? Parameters<typeof optionsParsers[T]>[0] : never;

export function parseOptions<T extends ParserName>(special: ParserName, args: ParserOptions<T>) {
  return optionsParsers[special](args);
}

export function parseName(str: string): [ProcessorName, OG] {
  const unprefixed = str.slice(1);
  const [operation, ...rest] = <[ProcessorName]>unprefixed
    .split(/ |\(/i)
    .map(s => s.trim())
    .filter(Boolean);
  const restString = rest.join(' ').trim();
  const args = safeArgsSplit(restString.endsWith(')')
    ? restString.slice(0, -1)
    : restString)
    .filter(Boolean);
  return [
    operation,
    args.length ? parseCopyOptions(args) : {},
  ];
}

type CopyDefinition = {
  count: number,
  name: string,
};

export function processCopy(definition: CopyDefinition & OG, object: OG) {
  const {
    count,
    name,
    ...rest
  } = definition;
  const {
    [name]: original
  } = object;

  const copies = {};
  for (let i = 1; i <= count; i += 1) {
    copies[`${name}-${i}`] = deepmerge(original, recusrsiveReplace(rest, '_index', i));
  }
  return copies;
}

export const processors = {
  copy: processCopy,
};

export type ProcessorName = keyof typeof processors;

type ProcessorDefinition<T extends ProcessorName> =
  T extends ProcessorName ? Parameters<typeof processors[T]>[0] : never;

export default function processDirective<T extends ProcessorName>(
  operation: ProcessorName,
  definition: ProcessorDefinition<T>,
  original: OriginalObject
) {
  const processor = processors[operation];
  if (!processor)
    throw new Error(`Unknown operation: ${operation}`);
  return processor(definition, original);
}
