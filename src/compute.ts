import type { Token } from './tokenize';

export type Functions = { [k: string]: (...args: any[]) => any };
export type Compute = (tokens: Token[], data: any, fns: Functions) => number;

export const resolveData = (original: any, data: any): number => {
  if (typeof original === 'string') {
    if (original.startsWith('$')) {
      return data[original.slice(1)] || 0;
    }
    // throw new Error(`Unknown value: ${original}`);
  }
  return original || 0;
}

// TODO: obviously, some refactoring is needed here
interface ResolveToken {
  (
    token: { value: string | number },
    data: any,
    fns: Functions
  ): number
  (
    token: { group: Token[] },
    data: any,
    fns: Functions
  ): number
  (
    token: { function: string; args: Token[] },
    data: any,
    fns: Functions
  ): number
}
export const resolveToken: ResolveToken = (token, data, fns) => {
  // @ts-ignore
  if (token?.group) {
    // @ts-ignore
    return compute(token.group, data, fns);
  }
  // @ts-ignore
  if (token?.function) {
    // @ts-ignore
    const processedArgs = <any>token.args
      .map((arg: any) => resolveToken(arg, data, fns))
    // @ts-ignore
    const fn = fns[token.function];
    if (typeof fn === 'function') {
      return fn(...processedArgs) || 0;
    }
    // @ts-ignore
    const mathFn = Math[token.function as keyof typeof Math];
    if (typeof mathFn === 'function') {
      // @ts-ignore
      return mathFn.apply(null, processedArgs) || 0;
    }
    return 0
  }
  // @ts-ignore
  return resolveData(token?.value, data);
}

const compute: Compute = (tokens, data, fns = {}) => {
  let value = resolveToken(tokens[0] as Parameters<ResolveToken>[0], data, fns) || 0;
  for (let t = 1; t < tokens.length; t += 2) {
    const operator = tokens[t]?.operator;

    let current = resolveToken(tokens[t + 1] as Parameters<ResolveToken>[0], data, fns) || 0;
    switch (operator) {
      case "+":
        value += current;
        break;
      case "-":
        value -= current;
        break;
      case "*":
        value *= current;
        break;
      case "/":
        value /= current;
        break;
      case "%":
        value %= current;
        break;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }
  return value;
}

export default compute;
