import classnames from 'classnames';
import * as React from 'react';
import './style.css';

export interface DropdownListItemProps {
  className?: string;
  isCategory?: boolean;
  tag?: string;
  children?: React.ReactChild | React.ReactChild[];
}

export const DropdownListItem: React.SFC<DropdownListItemProps> = ({
  className,
  isCategory = false,
  tag: Tag = 'li',
  children,
  ...attributes
}) => {
  return (
    <Tag
      {...attributes}
      className={classnames(
        'dropdown-list__item',
        isCategory && 'dropdown-list__item_category',
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default DropdownListItem;
