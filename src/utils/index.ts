import * as AuthUtils from './authUtils';
export {AuthUtils};

import * as TokenUtils from './tokenUtils';
export {TokenUtils};

export const nextId = () => Math.round(Math.random() * 10);
