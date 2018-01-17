import * as React from 'react';
import {WalletModel} from '../../models/index';
import {NumberFormat} from '../NumberFormat';

export interface SelectOptionProps {
  currency: string;
}

export const WalletOption = ({currency}: SelectOptionProps) => ({
  title,
  totalBalance
}: WalletModel) => (
  <div className="option">
    <div>{title}</div>
    <div>
      <small style={{color: 'gray'}}>
        <NumberFormat value={totalBalance} />&nbsp;{currency}
      </small>
    </div>
  </div>
);

export default WalletOption;
