import { load, YAMLNode } from 'yaml-ast-parser';
import { compute } from './compute';

const getRefValue = (path: string, node: YAMLNode) => {
  const split = path.split('/');
  const searched = split.shift();
  const found = node?.mappings?.find(({ key: { value: name } }) => name === searched);
  if (!found)
    return null;
  if (split.length === 0)
    return found.value.valueObject;
  return getRefValue(split.join('/'), found.value);
};

const refExp = /\$\/([a-z0-9\/]+)/ig;
export const resolveRefs = (input: string) => {
  const loaded = load(input);

  const itemsMapper = (node) => {
    const {
      value, valueObject, mappings, items,
    } = node;
    return {
      valueObject,
      value,
      mappings: mappings?.map(mappingsMapper),
      items: items?.map(itemsMapper)
    };
  };

  const mappingsMapper = ({
    key: {
      value: name
    }, value
  }) => {
    let processedValue = value?.value || value;
    const refs = Array.from(value?.value?.matchAll(refExp) || []);

    if (refs.length) {
      refs.forEach(([str, ref]) => {
        const refValue = getRefValue(ref, loaded);
        const number = Number(refValue);
        processedValue = processedValue.split(str).join(Number.isNaN(number) ? refValue : number);
        const processedAsNumber = Number(processedValue);
        if (!Number.isNaN(processedAsNumber)) {
          processedValue = processedAsNumber;
        } else {
          processedValue = compute(processedValue);
        }
      });
    }
    return {
      name,
      value: processedValue
    };
  };

  return loaded.mappings.map(mappingsMapper);
};
