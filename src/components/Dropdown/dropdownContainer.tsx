import classnames from 'classnames';
import * as React from 'react';
import './style.css';

export interface DropdownContainerProps {
  className?: string;
  tag?: string;
  children?: React.ReactChild | React.ReactChild[];
}

export const DropdownContainer: React.SFC<DropdownContainerProps> = ({
  className,
  tag: Tag = 'div',
  children,
  ...attributes
}) => {
  return (
    <Tag
      {...attributes}
      className={classnames('dropdown__container', className)}
    >
      <div className="dropdown__nav">{children}</div>
    </Tag>
  );
};

export default DropdownContainer;
