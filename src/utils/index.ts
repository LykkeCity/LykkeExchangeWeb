import * as AuthUtils from './authUtils';
export {AuthUtils};

import * as StorageUtils from './storageUtils';
export {StorageUtils};

let idx = 0;
export const nextId = () => idx++;

export const plural = (qnt: number, normalForm: string) =>
  qnt === 1 ? normalForm : normalForm.concat('s');

type AnyArgs = any[];
type AnyFunc = (...args: AnyArgs) => any;

// tslint:disable-next-line:variable-name
const _pipe = (f: AnyFunc, g: AnyFunc) => (...args: AnyArgs) => g(f(...args));

export const pipe = (...fns: AnyFunc[]) => fns.reduce(_pipe);

export const seq = (...fns: AnyFunc[]) => (...args: AnyArgs) =>
  fns.forEach(f => f(...args));
