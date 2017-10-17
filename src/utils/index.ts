import * as AuthUtils from './authUtils';
export {AuthUtils};

import * as TokenUtils from './tokenUtils';
export {TokenUtils};

let idx = 0;
export const nextId = () => idx++;

export const plural = (qnt: number, normalForm: string) =>
  qnt === 1 ? normalForm : normalForm.concat('s');
