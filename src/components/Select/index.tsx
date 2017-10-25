import classnames from 'classnames';
import * as React from 'react';

interface Option {
  value: string;
  label?: string;
}

interface SelectProps {
  options: Option[];
  value?: string;
  onChange?: React.FormEventHandler<HTMLSelectElement>;
  className?: string;
}

export const Select: React.SFC<SelectProps> = ({
  options,
  value,
  onChange,
  className
}) => (
  <select className={classnames('form__input', className)} onChange={onChange}>
    {options.map(o => (
      <option key={o.value} value={o.value}>
        {o.label || o.value}
      </option>
    ))}
  </select>
);

export default Select;
