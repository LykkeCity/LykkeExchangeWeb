import classnames from 'classnames';
import * as React from 'react';

interface FormInputProps {
  type: string;
  onChange?: React.FormEventHandler<HTMLInputElement>;
  value?: string;
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
    className={classnames('form__input', className)}
  />
);

export default FormInput;
