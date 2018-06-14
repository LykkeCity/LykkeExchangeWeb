import * as AuthUtils from './authUtils';
export {AuthUtils};

import * as StorageUtils from './storageUtils';
export {StorageUtils};

export {default as RandomString} from './randomString';

// tslint:disable-next-line:no-var-requires
const shajs = require('sha.js');

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

export const arraysEqual = (a: any[], b: any[]) => {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};

export const moneyCeil = (value: number, accuracy = 2) => {
  const SAFE_ACCURACY = accuracy >= 6 ? accuracy + 1 : accuracy + 4;

  return (
    Math.ceil(Number(value.toFixed(SAFE_ACCURACY)) * Math.pow(10, accuracy)) /
    Math.pow(10, accuracy)
  );
};

export const moneyFloor = (value: number, accuracy = 2) => {
  const SAFE_ACCURACY = accuracy >= 6 ? accuracy + 1 : accuracy + 4;

  return (
    Math.floor(Number(value.toFixed(SAFE_ACCURACY)) * Math.pow(10, accuracy)) /
    Math.pow(10, accuracy)
  );
};

export const copyTextToClipboard = (text: string) => {
  const textArea = document.createElement('textarea');

  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';

  textArea.style.width = '2em';
  textArea.style.height = '2em';

  textArea.style.padding = '0';

  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  textArea.style.background = 'transparent';

  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  let opResult = false;
  try {
    opResult = document.execCommand('copy');
  } catch {
    opResult = false;
    // tslint:disable-next-line:no-console
    console.warn('Oops, unable to copy');
  }

  document.body.removeChild(textArea);

  return opResult;
};

export const getHash = (
  value: string,
  algorithm: string = 'sha224',
  encoding: string = 'hex'
) =>
  shajs(algorithm)
    .update(value)
    .digest(encoding);
