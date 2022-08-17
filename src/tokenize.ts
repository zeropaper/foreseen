export const getBalancingParenthsis = (str: string): [number, number] | false => {
  let opened = 0;
  let closed = 0;
  let start = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') {
      if (!opened) start = i + 1;
      opened++;
    } else if (str[i] === ')') {
      closed++;
      if (opened - closed === 0) return [start, i];
    }

  }
  return false;
}

export const checkIfFunction = (current: string) => {
  const match = current.match(/([\/\-+%*]+\s*){0,1}([a-z]+)\s*$/i);
  return match ? match[2] : false;
}

export const safeArgsSplit = (str: string, sep: string = ','): string[] => {
  let opened = 0;
  let closed = 0;
  let start = 0;
  const strs: string[] = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i] === sep) {
      if (opened - closed === 0) {
        strs.push(str.slice(start, i));
        start = i + 1;
      }
    } else if (str[i] === '(') {
      opened++;
    } else if (str[i] === ')') {
      closed++;
    }
  }

  if (!strs.length) {
    strs.push(str.trim());
  } else {
    strs.push(str.slice(start).trim());
  }
  return strs;
}

export const toTrimmedStringOrNumber = (val: string): string | number => {
  const trimmed = val.trim();
  const asNumber = Number(trimmed);
  if (!Number.isNaN(asNumber)) {
    return asNumber;
  }
  return trimmed;
}

export const splitOperatorValues = (string: string) => {
  if (!string) return [];
  const groups: (string | number)[] = []
  Array.from(string.trim().matchAll(/([\-]{0,1}[^\/\-+%*]*)([\/\-+%*]{1,1})\s*([\-]{0,1}[^\/\-+%*]*)/g))
    .forEach((match, m) => {
      const [, rawLeft, rawOp, rawRight] = match;
      const left = toTrimmedStringOrNumber(rawLeft);
      const right = toTrimmedStringOrNumber(rawRight);
      const op = rawOp as any;
      if (!m && left) {
        if (rawRight) {
          groups.push(left, op, right)
        } else {
          groups.push(left, op)
        }
      } else if (left && op === '-') {
        groups.push(left, `-${right}`)
      } else if (rawRight) {
        groups.push(op, right)
      } else if (op) {
        groups.push(op)
      }
    });
  if (groups.length === 0) {
    const asNumber = Number(string);
    if (Number.isNaN(asNumber)) {
      return [string];
    } else {
      return [asNumber];
    }
  }
  return groups;
}

export const valueOrOperator = (v: string | number) => {
  if (typeof v === 'number') return { value: v };

  const trimmed = v.trim() || '';
  if (['+', '-', '%', '/', '*'].includes(trimmed)) {
    return {
      operator: trimmed,
    }
  }

  const asNumber = Number(trimmed);
  if (Number.isNaN(asNumber)) {
    return {
      value: trimmed,
    }
  }

  return {
    value: asNumber,
  }
};

type Obj = { [key: string]: any };
export type Token = (Obj & { value: string | number })
  | (Obj & { operator: string })
  | (Obj & { function: string, args: Token[] })
  | (Obj & { group: Token[] })
  | (Obj & { substr: string })
export const tokenize = (original: string, groups: Token[] = [], opts = {}): Token[] => {
  const found = getBalancingParenthsis(original);

  if (!found) {
    if (original) {
      groups.push(...splitOperatorValues(original).map(valueOrOperator))
    }
    return groups;
  }

  const [start, end] = found;
  const prev: any = groups.at(-1);
  const prevString = prev?.substr || original.slice(0, start - 1) || '';
  const substr = original.slice(start, end);

  const fnName = checkIfFunction(prevString);
  if (fnName) {
    // function, the previous group contains the function name
    // and needs to be recreated (removing the function name at the end)
    if (prev) {
      groups.pop();
    }

    const prevSubstr = prevString.slice(0, start - (fnName.length + 1)).trim()
    if (prevSubstr) {
      groups.push({
        substr: prevSubstr,
      })
    }

    const argStrings = safeArgsSplit(substr);
    const args: Token[] = [];
    argStrings.forEach((argString) => {
      const tokens = tokenize(argString, [], opts);
      args.push(tokens.length === 1 ? tokens[0] : { group: tokens });
    });
    groups.push({
      function: fnName,
      args,
    })
  } else {
    // simple parenthesis group
    // add the previous substring if it exists
    if (start > 1) {
      groups.push({
        substr: original.slice(0, start - 1),
      })
    }
    groups.push({
      group: tokenize(substr, [], opts),
    })
  }

  // tokenize the rest
  if (end < original.length) {
    tokenize(original.slice(end + 1), groups, opts)
  }

  // convert / expand groups the that are still
  // successions of values and operators (e.g. -1 + 2)
  // as a last pass before returning
  return groups.reduce((acc, group) => {
    if (group.substr) {
      acc.push(...splitOperatorValues(group.substr)
        .map(valueOrOperator));
    } else {
      acc.push(group);
    }
    return acc;
  }, [] as Token[]);
}

export default tokenize;