import * as AuthUtils from './authUtils';
export {AuthUtils};

import * as StorageUtils from './storageUtils';
export {StorageUtils};

let idx = 0;
export const nextId = () => idx++;

export const plural = (qnt: number, normalForm: string) =>
  qnt === 1 ? normalForm : normalForm.concat('s');
