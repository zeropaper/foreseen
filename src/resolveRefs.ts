import { YAMLMapping, YAMLNode, YAMLSequence } from 'yaml-ast-parser';
import { analysisExp } from './analyze';
import { compute } from './compute';

type FSValueProcessed = { valueProcessed?: string | number }
type FSNode = YAMLNode & FSValueProcessed
type FSSequence = YAMLSequence & FSValueProcessed

const getRefValue = (path: string | string[], node: YAMLSequence) => {
  const split = Array.isArray(path) ? path : path.split(/[\/\[\]]{1,1}/).filter(Boolean);
  const searched = split.shift();
  const searchedAsNumber = Number(searched)
  let found;
  if (!Number.isNaN(searchedAsNumber)) {
    found = node?.items?.[searchedAsNumber];
  } else {
    found = node?.mappings?.find(({ key: { value: name } }) => name === searched);
  }

  if (!found)
    return null;
  if (split.length === 0)
    return found.valueObject || found.value.valueObject;
  return getRefValue(split, found.value as YAMLSequence);
};

const refExp = /\$\/([a-z0-9\/\[\]]+)/ig;
export const resolveRefs = (loaded: YAMLNode): FSNode => {
  const itemsMapper = (node: YAMLSequence): YAMLSequence => {
    const {
      mappings,
      items,
    } = node;
    return {
      ...node,
      mappings: mappings ? mappings.map(mappingsMapper) : mappings,
      items: items ? items.map(itemsMapper) : items,
    };
  };

  const mappingsMapper = ({
    key,
    value: valueNode,
  }: YAMLMapping) => {
    let valueProcessed = valueNode?.value || valueNode;
    const refs = Array.from(valueNode?.value?.matchAll(refExp) || []);

    if (refs.length) {
      refs.forEach(([str, ref]) => {
        const refValue = getRefValue(ref, loaded as YAMLSequence);
        const number = Number(refValue);
        valueProcessed = valueProcessed.split(str).join(Number.isNaN(number) ? refValue : number);
      });
    }

    const processedAsNumber = Number(valueProcessed);
    if (!Number.isNaN(processedAsNumber)) {
      valueProcessed = processedAsNumber;
    } else if (typeof valueProcessed === 'string') {
      // console.info('valueProcessed', valueProcessed, valueProcessed.match(analysisExp));
      if (valueProcessed.match(analysisExp)) {
        valueProcessed = compute(valueProcessed);
      }
    }

    return {
      key,
      value: {
        ...valueNode,
        valueProcessed,
      }
    };
  };

  return {
    ...loaded,
    mappings: loaded.mappings.map(mappingsMapper)
  };
};
