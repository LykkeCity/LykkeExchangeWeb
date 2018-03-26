import * as React from 'react';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

// tslint:disable-next-line:no-var-requires
const TextMask = require('react-text-mask').default;

export interface AmountInputProps {
  onChange?: (e: React.ChangeEvent<any>) => void;
  value?: any;
  name?: string;
  decimalLimit?: number;
  maxLength?: number;
}

export const AmountInput: React.SFC<AmountInputProps> = ({
  onChange,
  value,
  name,
  decimalLimit = 8,
  maxLength = 10,
  ...attributes
}) => {
  const numberMask = createNumberMask({
    allowDecimal: true,
    allowLeadingZeroes: true,
    decimalLimit,
    includeThousandsSeparator: false,
    prefix: '',
    suffix: ''
  });
  return (
    <TextMask
      className="form-control"
      mask={numberMask}
      name={name}
      id={name}
      onChange={onChange}
      value={value || ''}
      maxLength={maxLength}
      {...attributes}
    />
  );
};
