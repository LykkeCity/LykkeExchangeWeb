import classnames from 'classnames';
import * as React from 'react';
import './style.css';

export interface DropdownControlProps {
  className?: string;
  tag?: string;
  children?: React.ReactChild | React.ReactChild[];
}

export const DropdownControl: React.SFC<DropdownControlProps> = ({
  className,
  tag: Tag = 'div',
  children,
  ...attributes
}) => {
  return (
    <Tag {...attributes} className={classnames('dropdown__control', className)}>
      {children}
    </Tag>
  );
};

export default DropdownControl;
