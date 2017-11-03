import classnames from 'classnames';
import * as React from 'react';

interface FormInputProps {
  type: string;
  onChange?: React.FormEventHandler<HTMLInputElement>;
  value?: string | number;
  className?: string;
}

export const FormInput: React.SFC<FormInputProps> = ({
  type,
  value,
  onChange,
  className
}) => (
  <input
    type={type}
    onChange={onChange}
    defaultValue={(value || '')!.toString()}
    className={classnames('form__input', className)}
  />
);

export default FormInput;
