import * as numeral from 'numeral';
import * as React from 'react';

interface NumberFormatProps {
  value: number;
  format?: string;
}

export const NumberFormat: React.SFC<NumberFormatProps> = ({
  value,
  format = '0,0[.]00'
}) => <span>{numeral(value).format(format)}</span>;
