import classnames from 'classnames';
import React from 'react';
import {NumberFormat} from '../NumberFormat';
import './style.css';

export interface ColoredAmountProps {
  accuracy: number;
  assetName?: string;
  className?: string;
  value: number;
}

export const ColoredAmount: React.SFC<ColoredAmountProps> = ({
  accuracy,
  assetName,
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
    <NumberFormat value={Math.abs(value)} accuracy={accuracy} />
    {assetName && ` ${assetName}`}
  </span>
);

export default ColoredAmount;
