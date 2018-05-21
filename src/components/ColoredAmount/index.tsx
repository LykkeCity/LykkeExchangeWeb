import classnames from 'classnames';
import React from 'react';
import {FormattedNumber} from 'react-intl';
import './style.css';

export interface ColoredAmountProps {
  accuracy: number;
  className?: string;
  value: number;
}

export const ColoredAmount: React.SFC<ColoredAmountProps> = ({
  accuracy,
  className,
  value,
  ...attributes
}) => (
  <span
    {...attributes}
    className={classnames(
      'colored-amount',
      {
        'colored-amount_negative': value < 0,
        'colored-amount_positive': value > 0
      },
      className
    )}
  >
    {value > 0 && '+'}
    {value < 0 && '–'}
    <FormattedNumber
      value={Math.abs(value)}
      style="decimal"
      maximumFractionDigits={accuracy}
    />
  </span>
);

export default ColoredAmount;
