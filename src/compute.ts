import { analysisExp, AnalysisResult, analyze } from './analyze';

const exec = (functionName: string, args: AnalysisResult[], data: object) => {
  try {
    return Math[functionName](...args.map(arg => compute(arg.join(' '), data)));
  } catch (e) {
    console.warn(`Failed to execute function "${functionName}" with args:`, args);
    return 0
  }
};

const compute = (str: string, data: object): number => {
  const matches = str.match(analysisExp)
  const groups = analyze(matches).map((item) => {
    if (typeof item === 'string' && item.startsWith('$')) {
      return data[item.slice(1) || 0];
    }
    return item
  });
  if (!groups.length) {
    return 0;
  }

  if (Array.isArray(groups[0]) && typeof groups[0][0] === 'string') {
    const [fn, ...args] = groups[0];
    return exec(fn, args as AnalysisResult[], data);
  }

  let result = Number(groups.shift());
  if (Number.isNaN(result))
    return 0;

  for (let i = 0; i < groups.length; i += 2) {
    const operator = groups[i];
    let value = groups[i + 1];

    if (Array.isArray(value)) {
      if (typeof value[0] === 'string') {
        if (Array.isArray(value[1])) {
          const [fn, ...args] = value;
          value = exec(fn, args as AnalysisResult[], data);
        }
      } else {
        value = compute(value.join(' '), data);
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