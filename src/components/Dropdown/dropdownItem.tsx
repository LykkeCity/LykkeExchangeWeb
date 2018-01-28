import {rem} from 'polished';
import * as React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {Theme} from '../theme';

const StyledDropdownItem = styled.div`
  & > a,
  & > span {
    font-size: ${rem('16px')};
    cursor: pointer;
    display: block;
    width: 100%;
    padding: ${rem('15px')} !important;
    border-radius: ${({theme}: Theme) => theme!.borderRadius};

    &:hover {
      background: ${({theme}: Theme) => theme!.color.gray5};
    }
    &:focus {
      text-decoration: none;
    }

    color: ${({theme}: Theme) => theme!.color.text};
  }
`;

interface DropdownItemProps {
  to?: string;
  onClick?: React.MouseEventHandler<any>;
  children: any;
}

const DropdownItem = ({to, children, onClick}: DropdownItemProps) => {
  let component: JSX.Element;

  if (to) {
    component = <Link to={to}>{children}</Link>;
  } else if (onClick) {
    component = <a onClick={onClick}>{children}</a>;
  } else {
    component = <span>{children}</span>;
  }

  return <StyledDropdownItem>{component}</StyledDropdownItem>;
};

export default DropdownItem;
