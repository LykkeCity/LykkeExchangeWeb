import * as React from 'react';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {TransferModel} from '../../models';
// tslint:disable-next-line:no-var-requires
const TextMask = require('react-text-mask').default;

export const AmountInput = (
  transfer: TransferModel,
  onChange: React.ChangeEventHandler<any>
) => {
  const numberMask = createNumberMask({
    allowDecimal: true,
    allowLeadingZeroes: true,
    decimalLimit: transfer.asset ? transfer.asset.accuracy : 8,
    includeThousandsSeparator: false,
    prefix: '',
    suffix: ''
  });

  return (
    <TextMask
      name="amount"
      id="tr_amount"
      mask={numberMask}
      className="form-control"
      value={transfer.amount || ''}
      onChange={onChange}
    />
  );
};
