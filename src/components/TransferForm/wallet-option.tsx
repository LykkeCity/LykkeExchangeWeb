import * as React from 'react';
import {WalletModel} from '../../models/index';
import {NumberFormat} from '../NumberFormat';
import {SelectItem} from '../Select';

export interface WalletOptionProps {
  currency: string;
}

interface SelectItemProps extends WalletModel {
  disabled?: boolean;
}

export const WalletOption = ({currency}: WalletOptionProps) => ({
  title,
  totalBalance,
  disabled
}: SelectItemProps) => (
  <SelectItem name={title} isGroup={disabled}>
    <NumberFormat value={totalBalance} />&nbsp;{currency}
  </SelectItem>
);

export default WalletOption;
