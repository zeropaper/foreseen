export type AnalysisResult = (string | number | AnalysisResult)[];

// deprecated 'Sc'
export { AnalysisResult as Sc };

export const analysisExp = /([a-z]*)\([^\)]+\)|[-]{0,1}[0-9.]+|[^0-9\s]{1,1}|[^\s]+/ig;

const includesOperator = (array: string[]) => {
  return array.some((str) => str.match(/[+\-*\/%]/));
};
export const getComputable = (str: string): false | string[] => {
  const matches = str.match(analysisExp)
  if (!matches) return false;
  console.info('matches', matches);
  if (matches.join('') === str.replace(/\s/g, '')) return false;
  if (!includesOperator(matches)) return false;
  return matches;
}

export const analyze = (matches: string[]): AnalysisResult => {
  // let matches = str.match(analysisExp);
  if (!matches) return [];
  if (matches.length === 2 && matches[1].startsWith('-')) {
    matches = [matches[0], '-', matches[1].slice(1)];
  }
  return matches.map(match => {
    if (!Number.isNaN(Number(match)))
      return Number(match);

    const item = match.trim();
    if (item.length === 1)
      return item;

    const openingIndex = item.indexOf('(');
    if (openingIndex === 0)
      return analyze(item.slice(1, -1).match(analysisExp));

    const functionName = item.slice(0, openingIndex);
    const subExpressions = item.slice(openingIndex + 1, -1).split(',').map(s => s.trim());
    return [
      functionName,
      ...subExpressions.map(s => analyze(s.match(analysisExp)))
    ];
  });
};
