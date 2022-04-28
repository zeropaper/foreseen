import type { Token } from './tokenize';

const api = {
  rad: (deg: number) => deg * Math.PI / 180,
}

export const resolveData = (original, data: any): number => {
  if (typeof original === 'string') {
    if (original.startsWith('$')) {
      return data[original.slice(1)] || 0;
    }
    throw new Error(`Unknown value: ${original}`);
  }
  return original || 0;
}

interface ResolveToken {
  (
    token: { value: string | number },
    data: any
  ): number
  (
    token: { group: Token[] },
    data: any
  ): number
  (
    token: { function: string; args: Token[] },
    data: any
  ): number
}
export const resolveToken: ResolveToken = (token, data) => {
  if (token?.group) {
    return compute(token.group, data);
  }
  if (token?.function) {
    const processedArgs = token.args
      .map((arg) => resolveToken(arg, data))
    return Math?.[token.function](...processedArgs) || 0;
  }
  return resolveData(token?.value, data);
}


const compute = (tokens: Token[], data: any): number => {
  let value = resolveToken(tokens[0] as Parameters<ResolveToken>[0], data) || 0;
  for (let t = 1; t < tokens.length; t += 2) {
    const operator = tokens[t]?.operator;

    let current = resolveToken(tokens[t + 1] as Parameters<ResolveToken>[0], data) || 0;
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
