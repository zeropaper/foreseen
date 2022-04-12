import { AnalysisResult, analyze } from './analyze';

const exec = (functionName: string, args: AnalysisResult[]) => {
  return Math[functionName](...args.map(arg => compute(arg.join(' '))));
};
const compute = (str: string): number => {
  const groups = analyze(str);
  if (!groups.length)
    return 0;

  if (Array.isArray(groups[0]) && typeof groups[0][0] === 'string') {
    const [fn, ...args] = groups[0];
    return exec(fn, args as AnalysisResult[]);
  }

  let result = Number(groups.shift());
  if (Number.isNaN(result))
    return 0;

  for (let i = 0; i < groups.length; i += 2) {
    const operator = groups[i];
    let value = groups[i + 1];

    if (Array.isArray(value)) {
      if (typeof value[0] === 'string') {
        const [fn, ...args] = value;
        value = exec(fn, args as AnalysisResult[]);
      } else {
        value = compute(value.join(' '));
      }
    }

    value = Number(value);
    if (Number.isNaN(value))
      return 0;

    switch (operator) {
      case '+':
        result += value;
        break;
      case '-':
        result -= value;
        break;
      case '*':
        result *= value;
        break;
      case '/':
        result /= value;
        break;
      case '%':
        result %= value;
        break;

      default:
        throw new Error(`Unknown operator "${operator}"`);
    }
  }

  return result;
};

export { compute };