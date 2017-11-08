// tslint:disable-next-line:variable-name
const _sum = (a: number) => (b: number) => a + b;

export const sum = (a: number, b: number) => _sum(a)(b);
