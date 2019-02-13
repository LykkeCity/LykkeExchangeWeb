import * as AuthUtils from './authUtils';
export {AuthUtils};

import * as StorageUtils from './storageUtils';
export {StorageUtils};

export {default as RandomString} from './randomString';

import BigNumberModel from './bigNumberModel';

// tslint:disable-next-line:no-var-requires
const shajs = require('sha.js');

// tslint:disable-next-line:no-var-requires
const Big = require('big.js');

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

export const calcSafeAccuracy = (accuracy: number) =>
  accuracy >= 6 ? accuracy + 1 : accuracy + 4;

export const moneyCeil = (value: number, accuracy = 2) => {
  value = Number.isFinite(value) ? value : 0;
  const factor = Math.pow(10, accuracy);
  return Math.ceil(new Big(value).times(factor).valueOf()) / factor;
};

export const moneyFloor = (value: number, accuracy = 2) => {
  value = Number.isFinite(value) ? value : 0;
  const factor = Math.pow(10, accuracy);
  return Math.floor(new Big(value).times(factor).valueOf()) / factor;
};

export const addition = (term1: number | string, term2: number | string) => {
  return new BigNumberModel(term1).plus(term2).toNumber();
};

export const subtraction = (
  value: number | string,
  decrement: number | string
) => {
  return new BigNumberModel(value).minus(decrement).toNumber();
};

export const moneyRound = (value: number, accuracy = 2) =>
  Math.round(
    Number((value || 0).toFixed(calcSafeAccuracy(accuracy))) *
      Math.pow(10, accuracy)
  ) / Math.pow(10, accuracy);

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
