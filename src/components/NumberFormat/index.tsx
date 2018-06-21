import {formatNumber} from '@lykkex/lykke.js';
import * as React from 'react';

const formattedNumber = formatNumber(0);

interface NumberFormatProps {
  value: number;
  accuracy: number;
}

export const NumberFormat: React.SFC<NumberFormatProps> = ({
  value,
  accuracy
}) => <span>{formattedNumber(value, accuracy)}</span>;
