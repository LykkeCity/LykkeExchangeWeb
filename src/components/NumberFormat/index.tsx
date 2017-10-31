import {observer} from 'mobx-react';
import * as numeral from 'numeral';
import * as React from 'react';

interface NumberFormatProps {
  value: number;
}

export const NumberFormat: React.SFC<NumberFormatProps> = ({value}) => (
  <span>{numeral(value).format('0,0[.]00')}</span>
);

export default observer(NumberFormat);
