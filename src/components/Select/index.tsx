import classnames from 'classnames';
import * as React from 'react';
import Select2, {ReactSelectProps} from 'react-select';
import 'react-select/dist/react-select.css';

export interface SelectOption {
  value: string;
  label?: string;
}

interface SelectProps extends ReactSelectProps<any> {
  options: any[];
  value?: string;
  onChange?: any;
  className?: string;
}

export const Select: React.SFC<SelectProps> = ({
  options,
  value,
  onChange,
  className,
  ...rest
}) => (
  <Select2
    value={value}
    options={options}
    onChange={onChange}
    className={classnames('form__select', className)}
    {...rest}
  />
);

export default Select;
