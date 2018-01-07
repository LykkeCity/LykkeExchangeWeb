import * as React from 'react';
import {WalletModel} from '../../models/index';
import {NumberFormat} from '../NumberFormat';
import {SelectItem} from '../Select';

export interface WalletValueProps {
  currency: string;
}

export const WalletValue = ({currency}: WalletValueProps) => ({
  title,
  totalBalance
}: WalletModel) => (
  <SelectItem name={title} valuePosition={'bottom'}>
    <NumberFormat value={totalBalance} />&nbsp;{currency}
  </SelectItem>
);

export default WalletValue;
