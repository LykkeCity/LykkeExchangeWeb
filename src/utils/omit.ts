export const omit = (obj: object, omitKeys: string[]) =>
  Object.keys(obj).filter(key => omitKeys.indexOf(key) < 0);
