import classnames from 'classnames';
import * as React from 'react';
import './style.css';

export interface FormSelectProps {
  className?: string;
  name?: string;
  onChange?: any;
  options: Array<{label: string; value: string}>;
  value?: string;
}

export const FormSelect: React.SFC<FormSelectProps> = ({
  className,
  name,
  onChange,
  options,
  value
}) => {
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="select">
      <div className="select__value">
        <span className="__value">
          {selectedOption ? selectedOption.label : '\u00A0'}
        </span>
      </div>
      <select
        id={name}
        name={name}
        className={classnames('form-control select__elem', className)}
        onChange={onChange}
        value={value}
      >
        <option key="" value="" disabled={true} />
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
