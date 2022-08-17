import { YAMLMapping } from "./types";

export const YAMLMappingsToObject = (array: YAMLMapping[]) => {
  const itemsMapper = (item: any) => typeof item?.value?.valueObject !== 'undefined' ? item?.value?.valueObject : item?.value?.value;

  const mappingsReducer = (obj: any, {
    key: { value: key }, value: valueNode,
  }: YAMLMapping) => {
    if (valueNode?.items) {
      obj[key] = valueNode.items.map(itemsMapper);
      return obj;
    }

    if (valueNode?.mappings) {
      obj[key] = valueNode.mappings.reduce(mappingsReducer, {});
      return obj;
    }

    if (!valueNode)
      return {};

    obj[key] = typeof valueNode.valueObject !== 'undefined'
      ? valueNode.valueObject
      : valueNode.value;
    return obj;
  };

  return array.reduce(mappingsReducer, {}) || {};
};
