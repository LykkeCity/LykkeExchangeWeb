import * as React from 'react';

const replaceNumber = (replacer: any) => (
  value: number,
  accuracy: number,
  options?: object
) => {
  options = {
    maximumFractionDigits: accuracy,
    minimumFractionDigits: accuracy,
    ...options
  };

  if (!Number.isFinite(value)) {
    if (typeof replacer === 'string') {
      return replacer;
    }
    value = replacer;
  }

  const result = value.toLocaleString(undefined, options);
  return checkForTrailingZero(result);
};

export const formattedNumber = replaceNumber(0);

export const checkForTrailingZero = (value: string): string => {
  const indexOfZero = value.search(/0+$/);
  const zeroesQuantity =
    value[indexOfZero - 1] === ',' || value[indexOfZero - 1] === '.' ? 2 : 1;
  return indexOfZero !== -1
    ? value.slice(0, indexOfZero + zeroesQuantity)
    : value;
};

interface NumberFormatProps {
  value: number;
  accuracy: number;
}

export const NumberFormat: React.SFC<NumberFormatProps> = ({
  value,
  accuracy
}) => <span>{formattedNumber(value, accuracy)}</span>;
